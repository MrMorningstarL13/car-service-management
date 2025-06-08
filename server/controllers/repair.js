const { Repair } = require('../models')

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
            
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = repairController;