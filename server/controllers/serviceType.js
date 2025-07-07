const { ServiceType, Service } = require('../models');

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
    },

    getServiceTypesByShop: async (req, res) => {
        try {
            const serviceTypes = await Service.findByPk(req.params.serviceId,{
                include: {
                    model: ServiceType,
                    as: 'service_types',
                    through: { attributes: [] },
                }
            })
            if(serviceTypes.length === 0){
                res.status(404).json("There are no service types.")
            } else {
                res.status(200).json(serviceTypes)
            }
        } catch (error) {
            console.warn("error when getting service types by shop")
        }
    },

    getServiceTypeName: async (req, res) => {
        try {
            const serviceType = await ServiceType.findByPk(req.params.serviceTypeId)

            if(!serviceType)
                return res.status(404).json("No service type found!")

            return res.status(200).json(serviceType.name[0].toUpperCase() + serviceType.name.substring(1))
        } catch (error) {
            res.status(500).json("error when getting service type name")
        }
    }
}

module.exports = serviceTypeController