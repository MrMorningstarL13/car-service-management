const { Invoice } = require("../models")
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
                success_url: 'http://localhost:5173/success-payment?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:5173/cancel-payment',
            });

            res.json({ url: session.url });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong creating the session' });
        }
    },
}

module.exports = invoiceController