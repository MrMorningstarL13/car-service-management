const {appointmentController} = require('../controllers')
const express = require('express')
const router = express.Router();

router.post('/create/:carId/:serviceId', appointmentController.createAppointment)

module.exports = router