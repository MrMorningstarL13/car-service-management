const { Op } = require('sequelize');
const { Appointment, Car, Repair, Service, User } = require('../models')

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
            const authUserId = req.params.userId;

            const user = await User.findOne({
                where: { authUserId }
            });

            if (!user) {
                return res.status(404).json("User not found");
            }

            const carsWithAppointments = await Car.findAll({
                where: { userId: user.id },
                attributes: ['id', 'brand', 'model', 'yearOfProduction'],
                include: [
                    {
                        model: Appointment,
                        attributes: ['id', 'scheduledDate', 'status', 'serviceId', 'invoiceId', 'checkIn', 'checkOut', 'estimatedDuration', 'estimatedCost']
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
            const searchedAppointment = await Appointment.findByPk(req.params.appointmentId);
            if (!searchedAppointment) {
                return res.status(404).json("Appointment not found");
            }

            const updatedAppointment = await searchedAppointment.update(req.body);
            if (!updatedAppointment) {
                return res.status(500).json("Failed to update appointment");
            }
            return res.status(200).json(updatedAppointment);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },
    markAppointmentWaitingPayment: async( req, res ) => {
        try {
            const {appointmentId} = req.params

            const searchedAppointment = await Appointment.findByPk(appointmentId,
                {
                    include: {
                        model: Repair,
                        attributes: ['isComplete']
                    }
                }
            )

            if(searchedAppointment.status === "finished")
                return res.status(400).json("Appointment is already marked as completed!")

            if(searchedAppointment.status === 'cancelled')
                return res.status(400).json("Can't complete a cancelled appointment")

            if(searchedAppointment.repairs.some((el) => {
                return !el.isComplete
            })){
                return res.status(400).json("There are still repairs undergoing!")
            } else {
                searchedAppointment.status = "waiting_payment";
                await searchedAppointment.save();
                return res.status(200).json("Appointment marked as waiting payment successfuly")
            }
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
}

module.exports = controller