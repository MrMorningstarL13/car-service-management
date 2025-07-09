const { Invoice } = require("../models")
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_API_KEY)

const invoiceController = {
    createCheckoutSession: async (req, res) => {
        try {

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                //aici pun appointmentul final
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Example Product',
                            },
                            unit_amount: 2000,
                        },
                        quantity: 1,
                    },
                ],
                success_url: 'http://localhost:3000/success',
                cancel_url: 'http://localhost:3000/cancel',  
            });

            res.json({ url: session.url });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong creating the session' });
        }
    },
}

module.exports = invoiceController