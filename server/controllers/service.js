const { Service } = require('../models')
const { ServiceType } = require('../models')

const serviceController = {
    create: async (req, res) => {
        try {
            const data = req.body;

            const fullAddress = encodeURIComponent(`${data.address}, ${data.city}`)

            const url = `https://api.opencagedata.com/geocode/v1/json?q=${fullAddress}&key=${process.env.OPENCAGE_API_KEY}`

            const apiResult = await fetch(url);
            const apiResultJson = await apiResult.json()

            let completeServiceData

            if (apiResultJson) {
                let { lat, lng } = apiResultJson.results[0].geometry
                completeServiceData = {
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
            const { origin } = req.body;

            const services = await Service.findAll({
                include: {
                    model: ServiceType,
                    as: 'service_types',
                }
            });

            if (services.length === 0) {
                res.status(404).json("There are no services.")
            } 

            if (!origin){
                return res.status(200).json(services)
            }

            const originString = `${origin.lat},${origin.lng}`;
            const destinationsString = services.map(s => `${s.lat},${s.lng}`).join('|');

            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originString}&destinations=${destinationsString}&mode=driving&key=${process.env.MAPS_API_KEY}`

            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== "OK") {
                return res.status(500).json("Error fetching data from Maps API")
            }

            console.log(data)
            if(data.rows[0].elements.every( (element ) => element.status === "ZERO_RESULTS")) {
                return res.status(404).json("No shops found withing a reachable driving distance.")
            }

            const plainServices = services.map( service => service.get({ plain: true }) );

            const sortedShops = plainServices.map((service, index) => ({
                ...service,
                distanceText: data.rows[0].elements[index].distance.text,
                distanceValue: data.rows[0].elements[index].distance.value,
                durationText: data.rows[0].elements[index].duration.text,
                durationValue: data.rows[0].elements[index].duration.value,
            })).sort((a, b) => a.distanceValue - b.distanceValue);

            if (sortedShops.length === 0) {
                return res.status(404).json("No shops found")
            } else {
                res.status(200).json(sortedShops);
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
    getDistances: async (req, res) => {
        const { destinations, origin } = req.body;

        const origins = `${origin.lat},${origin.lng}`;
        const destinationsString = destinations.map(d => `${d.lat},${d.lng}`).join('|');

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinationsString}&mode=driving&key=${process.env.MAPS_API_KEY}`

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== "OK") {
                return res.status(500).json("Error fetching data from Maps API")
            }

            console.log(data.rows[0].elements)

            const sortedShops = destinations.map((dest, index) => ({
                ...dest,
                distanceText: data.rows[0].elements[index].distance.text,
                distanceValue: data.rows[0].elements[index].distance.value,
                durationText: data.rows[0].elements[index].duration.text,
                durationValue: data.rows[0].elements[index].duration.value,
            })).sort((a, b) => a.distanceValue - b.distanceValue);

            if (sortedShops.length === 0) {
                return res.status(404).json("No shops found")
            } else {
                res.status(200).json(sortedShops);
            }
        } catch (error) {
            console.warn("Error when getting distances", error)
            res.status(500).json("There was an error when getting distances")
        }
    }
}

module.exports = serviceController;