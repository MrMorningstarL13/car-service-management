const { ServiceType } = require('../models');

const serviceTypeController = {
    createServiceType: async (req, res) => {
        try {
            const data = req.body
            const createdServiceType = await ServiceType.create(data)
            if(createdServiceType){
                res.status(200).json(createdServiceType)
            } else {
                res.status(500).json("received service type is not ok")
            }
        } catch (error) {
            console.warn("error when creating a service type")
        }
    },

    getAllServiceTypes: async(req, res) => {
        try {
            const serviceTypes = await ServiceType.findAll()
            if(serviceTypes.length === 0){
                res.status(404).json("There are no service types.")
            } else {
                res.status(200).json(serviceTypes)
            }
        } catch (error) {
            console.warn("error when getting all service types")
        }
    }
}

module.exports = serviceTypeController