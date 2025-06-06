const { Service } = require('../models')
const { ServiceType } = require('../models')

const OPENCAGE_API_KEY = "6e3710ec44c149cb95e7a21de41f1a72"

const serviceController = {
    create: async (req, res) => {
        try {
            const data = req.body;
            
            const fullAddress = encodeURIComponent(`${data.address}, ${data.city}`)

            const url = `https://api.opencagedata.com/geocode/v1/json?q=${fullAddress}&key=${OPENCAGE_API_KEY}`

            const apiResult = await fetch(url);
            const apiResultJson = await apiResult.json()

            let completeServiceData
            
            if(apiResultJson){
                let { lat, lng } = apiResultJson.results[0].geometry
                completeServiceData ={
                    ...data,
                    lat,
                    lng,
                }
            }
            
            if (completeServiceData) {
                const createdService = await Service.create(completeServiceData);
                res.status(200).json(completeServiceData);
            } else {
                res.status(400).json('Failed to create service.');
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    getAll: async (req, res) => {
        try {
            const services = await Service.findAll({
                include: {
                    model: ServiceType,
                    as: 'service_types',
                }
            });

            if (services.length === 0) {
                res.status(404).json("There are no services.")
            } else {
                res.status(200).json(services)
            }

        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    getById: async (req, res) => {
        try {
            const serviceId = req.params.serviceId;

            const searchedService = Service.findByPk(serviceId)

            if (searchedService) {
                res.status(200).json(searchedService)
            } else {
                res.status(404).json("No such service was found.")
            }
        } catch (error) {
            res.status(500).json('An error ocurred while getting the specified service.')
        }
    },

    addServiceTypeToShop: async (req, res) => {
        try {
            
            const service = await Service.findByPk(req.params.shopId)

            if (!service) {
                res.status(404).json("Shop not found")
            } else {
                const searchedServiceType = await ServiceType.findOne({ where: { name: req.params.serviceTypeName } })
                if (!searchedServiceType) {
                    res.status(404).json("Service type not found")
                } else {
                    const wasAssigned = await service.addService_type(searchedServiceType)

                    if (wasAssigned) {
                        res.status(200).json("Service type was added successfully")
                    } else {
                        res.status(404).json("Service type was not added to shop")
                    }

                }
            }

        } catch (error) {
            console.warn("error when adding service type to shop")
        }
    },
    getDistances: async(req, res) => {
        const { destinations, origin } = req.body;

        
        
    }

}

module.exports = serviceController;