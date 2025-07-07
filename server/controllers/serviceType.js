const { ServiceType, Service } = require('../models');

const serviceTypeController = {
    createServiceType: async (req, res) => {
        const { serviceId } = req.params

        try {
            const service = await Service.findByPk(serviceId)
            if (!service) {
                return res.status(404).json({ message: 'Service not found' })
            }

            const serviceTypeData = {
                ...req.body,
                serviceId,
            }

            const newServiceType = await ServiceType.create(serviceTypeData)

            return res.status(201).json(newServiceType)
        } catch (error) {
            console.error('Error when creating a service type:', error)
            return res.status(500).json({ message: 'Failed to create service type' })
        }
    },

    update: async (req, res) => {
        try {
            const {serviceTypeId} = req.params

            const serviceType = await ServiceType.findByPk(serviceTypeId)
            if(!serviceType)
                return res.status(404).json("The specified service type was not found")
            
            const updatedServiceType = await serviceType.update(req.body)

            return res.status(200).json(updatedServiceType)
        
        } catch (error) {
            return res.status(500).json({ message: "Error updating service type"})
        }
    },

    delete: async (req, res) => {
        try {
            const { serviceTypeId } = req.params;

            const serviceType = await ServiceType.findByPk(serviceTypeId);
            if (!serviceType) {
                return res.status(404).json({ message: "Service type not found" });
            }

            await serviceType.destroy();
            return res.status(200).json({ message: "Service type deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting service type" });
        }
    },

    getAllServiceTypes: async (req, res) => {
        try {
            const serviceTypes = await ServiceType.findAll()
            if (serviceTypes.length === 0) {
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
            const { serviceId } = req.params
            const serviceTypes = await ServiceType.findAll({
                where: {serviceId}
            })
            if (serviceTypes.length === 0) {
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

            if (!serviceType)
                return res.status(404).json("No service type found!")

            return res.status(200).json(serviceType.name[0].toUpperCase() + serviceType.name.substring(1))
        } catch (error) {
            res.status(500).json("error when getting service type name")
        }
    }
}

module.exports = serviceTypeController