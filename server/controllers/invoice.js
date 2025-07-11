const { Invoice, Appointment } = require("../models")
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_API_KEY)

const invoiceController = {
    createCheckoutSession: async (req, res) => {
        try {
            const invoiceData = req.body

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: `Appointment ID: ${invoiceData.appointmentId}`,
                            },
                            unit_amount: invoiceData.appointment.estimatedCost * 100,
                        },
                        quantity: 1,
                    },
                ],
                success_url: 'http://localhost:5173/success-payment',
                cancel_url: 'http://localhost:5173/cancel-payment',
                metadata: {
                    appointmentId: String(invoiceData.appointmentId),
                }
            });

            res.json({ url: session.url });
        } catch (error) {
            res.status(500).json({ error: 'Something went wrong creating the session' });
        }
    },
    handleWebhook: async(req, res) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_ID;

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                console.log("💵 Checkout completed for:", session);

                const appointmentId = session.metadata.appointmentId

                const searchedAppointment = await Appointment.findByPk(appointmentId)
                console.log("searchedAppointment", searchedAppointment)

                const createdInvoice = await Invoice.create({
                    finalCost: searchedAppointment.estimatedCost,
                    paymentMethod: "card",
                    paymentDate: new Date(),
                });
                console.log('createdInvoice', createdInvoice)
                
                searchedAppointment.invoiceId = createdInvoice.id
                searchedAppointment.status = "finished"

                await searchedAppointment.save()
            }

            res.status(200).send('Webhook received');
        } catch (err) {
            console.error("❌ Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}

module.exports = invoiceController