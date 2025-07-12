const {invoiceController} = require('../controllers')
const express = require('express')
const router = express.Router()

router.post('/create-checkout-session', invoiceController.createCheckoutSession);
router.get('/downloadInvoice/:invoiceId', invoiceController.downloadInvoice)

module.exports = router;