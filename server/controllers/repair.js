const { Repair, Car, Appointment } = require('../models')

const repairController = {
    createRepair: async (req, res) => {
        try {
            const { appointmentId, serviceTypeId } = req.params;
            console.log(appointmentId, serviceTypeId)

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
    assignEmployeeToRepair: async (req, res) => {
        try {
            const { repairId, employeeId } = req.params

            const searchedRepair = await Repair.findByPk(repairId)

            if (!searchedRepair)
                return res.status(404).json("No repair was found for the specified ID!")

            if(searchedRepair.employeeId === employeeId)
                return res.status(400).json("This task is already assigned to this employee!")

            searchedRepair.employeeId = employeeId

            await searchedRepair.save()
            return res.status("Employee was assigned with success")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    completeRepair: async (req, res) => {
        try {
            const { repairId } = req.params

            const searchedRepair = await Repair.findByPk(repairId)

            if (!searchedRepair)
                return res.status(404).json("No repair found for the specified ID")
            console.log(searchedRepair)
            if (searchedRepair.isComplete === true)
                return res.status(400).json("The specified repair has already been completed")

            searchedRepair.isComplete = true
            await searchedRepair.save()
            return res.status(200).json(searchedRepair)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    getRepairsByEmployee: async (req, res) => {
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

            if (!searchedRepairs)
                return res.status(404).json("No repairs found!")

            return res.status(200).json(searchedRepairs)
        } catch (error) {
            return res.status(500).json("An unexpected server error has occured!")
        }
    }
}

module.exports = repairController;