const { Op } = require('sequelize');
const { Appointment, Car, Repair, Service } = require('../models')

const controller = {
    createAppointment: async (req, res) => {
        try {
            const data = req.body;
            const { carId, serviceId } = req.params;

            const appointmentData = { ...data, carId, serviceId };

            const wantedService = await Service.findByPk(serviceId);
            if (!wantedService) {
                return res.status(404).json('Service not found');
            }
            const maxAppointments = wantedService.max_no_appointments ?? 0;

            const dateOnly = appointmentData.scheduledDate.split('T')[0];
            const startOfDay = new Date(`${dateOnly}T00:00:00`);
            const endOfDay = new Date(`${dateOnly}T23:59:59.999`);

            const count = await Appointment.count({
                where: {
                    serviceId,
                    scheduledDate: { [Op.between]: [startOfDay, endOfDay] }
                }
            });

            console.log('max / booked', maxAppointments, count);

            if (count >= maxAppointments) {
                return res.status(400).json('The maximum limit of appointments has been reached for the selected date. Please choose another.');
            }

            const response = await Appointment.create(appointmentData);
            return res.status(201).json(response);

        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
    getAppointmentsByUser: async (req, res) => {
        try {
            const userId = req.params.userId

            const carsWithAppointments = await Car.findAll({
                where: { userId },
                attributes: ['id', 'brand', 'model', 'yearOfProduction'],
                include: [
                    {
                        model: Appointment,
                        attributes: ['id', 'scheduledDate', 'status', 'serviceId', 'checkIn', 'checkOut', 'estimatedDuration', 'estimatedCost']
                    },
                ],
            });

            if (carsWithAppointments.length === 0) {
                return res.status(404).json("No cars were found. Consider adding a car beforehand")
            }

            return res.status(200).json(carsWithAppointments)

        } catch (error) {
            return res.status(500).send(error.message)
        }
    },
    getByService: async (req, res) => {
        try {
            const { serviceId } = req.params

            const appointments = await Appointment.findAll({
                where: { serviceId },
                include: {
                    model: Repair
                }
            })

            if (appointments.length === 0) {
                return res.status(404).json("No appointments were found for this service")
            }

            return res.status(200).json(appointments)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    updateAppointment: async (req, res) => {
        try {
            const searchedAppointment = await Appointment.findByPk(req.params.appointmentId)
            if (!searchedAppointment) {
                return res.status(404).json("Appointment not found")
            }
            const updatedAppointment = await searchedAppointment.update(req.body)

            return res.status(200).json(updatedAppointment)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = controller