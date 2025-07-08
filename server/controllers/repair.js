const { Repair, Car, Appointment } = require('../models')

const repairController = {
    createRepair: async(req, res) => {
        try {
            const { appointmentId, serviceTypeId } = req.params;
            console.log( appointmentId, serviceTypeId )
            
            const result = await Repair.create({ appointmentId, serviceTypeId });
            console.log(result)

            if (!result) {
                return res.status(400).json("Error when creating repair")
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    assignRepair: async(req, res) => {
        try {
            const { repairId, employeeId } = req.params
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    getRepairsByEmployee: async(req, res) => {
        try {
            const { employeeId } = req.params

            const searchedRepairs = await Car.findAll({
                include: {
                    model: Appointment,
                    include: {
                        model: Repair,
                        where: employeeId
                    }
                }
            })

            if(!searchedRepairs)
                return res.status(404).json("No repairs found!")

            return res.status(200).json(searchedRepairs)
        } catch (error) {
            return res.status(500).json("An unexpected server error has occured!")
        }
    }
}

module.exports = repairController;