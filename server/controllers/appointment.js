const {Appointment} = require('../models')

const controller = {
    createAppointment: async(req, res) => {
        try {
            const data = req.body;
            const {carId, serviceId} = req.params;
    
            const appointmentData = {...data, carId, serviceId}
    
            console.log(appointmentData)
            const response = await Appointment.create(appointmentData)
            console.log(response)
    
            if(!response){
                return res.status(400).json("Error when creating appointment")
            }
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).send(error.message)
        }
    },
}

module.exports = controller