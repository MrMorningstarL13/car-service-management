const { Service } = require('../models')
const { ServiceType } = require('../models')

const serviceController = {
    create: async (req, res) => {
        try {
            const data = req.body;
            const createdService = await Service.create(data);

            if (createdService) {
                res.status(200).json(createdService);
            } else {
                res.status(400).json('Failed to create service.');
            }
        } catch (error) {
            res.status(500).json('An error occurred while creating the service.');
        }
    },

    getAll: async (req, res) => {
        try {
            const services = await Service.findAll();

            if(services.length === 0){
                res.status(404).json("There are no services.")
            } else {
                res.status(200).json(services)
            }

        } catch (error) {
            res.status(500).json('An error occurred while getting the services.');
        }
    },

    getById: async (req, res) => {
        try {
            const serviceId = req.params.serviceId;

            const searchedService = Service.findByPk(serviceId)

            if(searchedService){
                res.status(200).json(searchedService)
            } else {
                res.status(404).json("No such service was found.")
            }
        } catch (error) {
            res.status(500).json('An error ocurred while getting the specified service.')
        }
    },

    getServiceTypesByShop: async (req, res) => {
        try {
            const { shopId } = req.params
            const searchedShop = await Service.findByPk(shopId, {
                include: [{
                    model: ServiceType,
                    as: 'serviceTypes',
                    through: {
                        attributes: [],
                    },
                }]
            })

            if(!searchedShop) {
                res.status(404).json("Shop not found")
            } else {

            }
            
        } catch (error) {
            console.warn("error when getting all service types")
        }
    },

    addServiceTypeToShop: async (req, res) => {
        try {
        
            const service = await Service.findByPk(req.params.shopId)
            const searchedServiceType = await ServiceType.findOne({ where: { name: req.params.serviceTypeName } })
            const wasAssigned = await service.addServiceType(searchedServiceType)

            if(wasAssigned) {
                res.status(200).json("Service type was added successfully")
            } else {
                res.status(404).json("Service type was not added to shop")
            }
        
        } catch (error) {
            console.warn("error when adding service type to shop")
        }
    }
}

module.exports = serviceController;