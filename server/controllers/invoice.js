const { Invoice, Appointment, Car, Service, User, AuthUser, ServiceType, Repair } = require("../models")
const Stripe = require('stripe')
const puppeteer = require('puppeteer');

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
    handleWebhook: async (req, res) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_ID;

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;

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

            res.status(200).send('webhook received');
        } catch (err) {
            return res.status(400).send(`webhook Error: ${err.message}`);
        }
    },
    downloadInvoice: async (req, res) => {
        try {
            const { invoiceId } = req.params;

            const invoice = await Invoice.findByPk(invoiceId, {
                include: {
                    model: Appointment,
                    include: [
                        { model: Car, include: [User] },
                        Service,
                        {
                            model: Repair,
                            include: [ServiceType],
                        }
                    ]
                }
            });


            if (!invoice) return res.status(404).json({ message: "Invoice not found" });

            const appointment = invoice.appointment;
            const car = appointment.car;
            const user = car.user;
            const service = appointment.service;

            const authUser = await AuthUser.findByPk(user.authUserId);
            if (!authUser) return res.status(404).json({ message: "User not found" });

            const calculatedTotal = appointment.repairs.reduce((sum, repair) => {
                const type = repair.service_type;
                return sum + parseFloat(type?.baseCost || 0);
            }, 0);

            const pricesChanged = Math.abs(calculatedTotal - invoice.finalCost) > 0.01;

            const html = `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 40px;
        background-color: #f8f9f4;
        color: rgba(84,67,67,1);
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        overflow: hidden;
        border: 1px solid rgba(189,198,103,0.3);
      }
      .header {
        background: linear-gradient(135deg, rgba(119,150,109,1) 0%, rgba(98,109,88,1) 100%);
        color: white;
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0 0 10px 0;
        font-size: 2.5rem;
        font-weight: bold;
      }
      .header p {
        margin: 5px 0;
        opacity: 0.9;
        font-size: 1.1rem;
      }
      .content {
        padding: 30px;
      }
      .section {
        margin-bottom: 30px;
        padding: 20px;
        background-color: rgba(189,198,103,0.05);
        border-radius: 8px;
        border: 1px solid rgba(189,198,103,0.2);
      }
      .section h2 {
        color: rgba(84,67,67,1);
        margin: 0 0 15px 0;
        font-size: 1.5rem;
        font-weight: bold;
        border-bottom: 2px solid rgba(119,150,109,1);
        padding-bottom: 8px;
      }
      .section p {
        margin: 8px 0;
        line-height: 1.6;
      }
      .section strong {
        color: rgba(98,109,88,1);
        font-weight: 600;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      th, td {
        border: 1px solid rgba(189,198,103,0.3);
        padding: 15px;
        text-align: left;
      }
      th {
        background-color: rgba(119,150,109,1);
        color: white;
        font-weight: 600;
        font-size: 1.1rem;
      }
      td {
        background-color: white;
        font-size: 1rem;
      }
      .total-row {
        background-color: rgba(189,198,103,0.1) !important;
        font-weight: bold;
        font-size: 1.2rem;
      }
      .payment-info {
        background-color: rgba(119,150,109,0.05);
        border: 1px solid rgba(119,150,109,0.2);
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
      }
      .payment-info p {
        margin: 10px 0;
        font-size: 1.1rem;
      }
      .footer {
        background-color: rgba(189,198,103,0.1);
        text-align: center;
        color: rgba(84,67,67,0.8);
        padding: 25px;
        border-top: 1px solid rgba(189,198,103,0.3);
        font-size: 1.1rem;
        font-style: italic;
      }
      .car-details {
        background: linear-gradient(135deg, rgba(189,198,103,0.1) 0%, rgba(119,150,109,0.1) 100%);
        border: 1px solid rgba(189,198,103,0.3);
        border-radius: 8px;
        padding: 20px;
        font-size: 1.2rem;
        font-weight: 500;
        color: rgba(84,67,67,1);
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Invoice #${invoice.id}</h1>
        <p>${service.name}</p>
        <p>${service.address}, ${service.city}</p>
      </div>
      <div class="content">
        <div class="section">
          <h2>Client Information</h2>
          <p><strong>Name:</strong> ${authUser.firstName} ${authUser.lastName}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
        </div>
        <div class="section">
          <h2>Car Details</h2>
          <div class="car-details">
            ${car.brand} ${car.model} (${car.yearOfProduction}) - Plate: ${car.plateNumber}
          </div>
        </div>
        <div class="section">
          <h2>Invoice Details</h2>
          <table>
            <thead>
              <tr><th>Description</th><th>Price</th></tr>
            </thead>
            <tbody>
  ${appointment.repairs.map(repair => {
                const type = repair.service_type;
                return `
      <tr>
        <td>${type?.name || 'Service Type'}</td>
        <td>$${parseFloat(type?.baseCost || 0).toFixed(2)}</td>
      </tr>
    `;
            }).join('')}
  <tr class="total-row">
    <td>Total</td>
    <td>$${invoice.finalCost.toFixed(2)}</td>
  </tr>
</tbody>
${pricesChanged ? `
  <tfoot>
    <tr>
      <td colspan="2" style="padding-top: 15px; color: #a94442; font-style: italic; font-size: 1rem;">
        Note: Service type prices have changed since this appointment. Final invoice amount remains as initially agreed.
      </td>
    </tr>
  </tfoot>
` : ''}

          </table>
          <div class="payment-info">
            <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>
            <p><strong>Payment Date:</strong> ${invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for choosing our service!</p>
      </div>
    </div>
  </body>
</html>
`;


            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
            });

            await browser.close();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice.id}.pdf`);
            res.setHeader('Content-Length', pdfBuffer.length);

            return res.end(pdfBuffer);

        } catch (error) {
            console.error("Error generating invoice:", error);
            return res.status(500).json({ error: "Error downloading invoice" });
        }
    }
}

module.exports = invoiceController