const {appointmentController} = require('../controllers')
const express = require('express')
const router = express.Router();

router.post('/create/:carId/:serviceId', appointmentController.createAppointment)
router.get('/getByUser/:userId', appointmentController.getAppointmentsByUser)
router.patch('/update/:appointmentId', appointmentController.updateAppointment)
router.get("/getByService/:serviceId", appointmentController.getByService);

module.exports = router