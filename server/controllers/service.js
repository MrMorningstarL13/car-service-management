const { Service } = require('../models')

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
    }
}

module.exports = serviceController;