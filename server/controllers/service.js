const { Op, fn, col } = require("sequelize")
const {
    Invoice,
    Appointment,
    Employee,
    Repair,
    ServiceType,
    Service,
} = require("../models")

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
                const employee = await Employee.findOne({ where: {authUserId: req.params.employeeId}})
                console.log("3",Object.getOwnPropertyNames(Object.getPrototypeOf(employee)));

                employee.setService(createdService)
                res.status(200).json(createdService);
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

            if (!origin) {
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

            if (data.rows[0].elements.every((element) => element.status === "ZERO_RESULTS")) {
                return res.status(404).json("No shops found withing a reachable driving distance.")
            }

            const plainServices = services.map(service => service.get({ plain: true }));

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

            const searchedService = await Service.findByPk(serviceId)

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
            console.warn("Error when getting distances")
            res.status(500).json("There was an error when getting distances")
        }
    },
    update: async (req, res) => {
        try {
            const serviceId = req.params.serviceId;
            const updateData = req.body;

            const service = await Service.findByPk(serviceId);

            if (!service) {
                return res.status(404).json("Service not found.");
            }

            await service.update(updateData);

            res.status(200).json(service);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },
    getRepresentativeStatistics: async (req, res) => {
        try {
            const { serviceId } = req.params

            const service = await Service.findByPk(serviceId)
            if (!service) return res.status(404).json({ message: "Service not found" })

            const now = new Date()
            const currentYear = now.getFullYear()
            const currentMonth = now.getMonth()
            const monthStart = new Date(currentYear, currentMonth, 1)
            const monthEnd = new Date(currentYear, currentMonth + 1, 0)

            // Get all invoice IDs for non-cancelled appointments in this service
            const appointmentsWithInvoices = await Appointment.findAll({
                where: {
                    serviceId,
                    invoiceId: { [Op.ne]: null },
                    status: { [Op.ne]: "cancelled" },
                },
                attributes: ['invoiceId'],
                raw: true,
            })

            const invoiceIds = appointmentsWithInvoices.map(a => a.invoiceId)

            // Total Revenue
            const totalRevenue = await Invoice.sum("finalCost", {
                where: {
                    id: invoiceIds,
                },
            })

            // Current Month Revenue
            const currentMonthRevenue = await Invoice.sum("finalCost", {
                where: {
                    id: invoiceIds,
                    paymentDate: {
                        [Op.between]: [monthStart, monthEnd],
                    },
                },
            })

            // Active Employees
            const activeEmployees = await Employee.count({
                where: { serviceId },
            })

            // Completed Appointments (non-cancelled)
            const completedAppointments = await Appointment.count({
                where: {
                    serviceId,
                    status: "finished",
                },
            })

            // Service Type Distribution (only non-cancelled appointments)
            const serviceTypeCounts = await Repair.findAll({
                attributes: [
                    "serviceTypeId",
                    [fn("COUNT", col("serviceTypeId")), "count"],
                ],
                include: [
                    {
                        model: ServiceType,
                        attributes: ["name"],
                        where: { serviceId },
                    },
                    {
                        model: Appointment,
                        attributes: [],
                        where: {
                            serviceId,
                            status: { [Op.ne]: "cancelled" },
                        },
                    },
                ],
                group: ["repair.serviceTypeId", "service_type.id"],
            })

            const serviceTypeDistribution = serviceTypeCounts.map((entry) => ({
                name: entry.service_type.name,
                value: parseInt(entry.dataValues.count),
            }))

            // Monthly Trends (non-cancelled only)
            const oneYearAgo = new Date(currentYear - 1, currentMonth + 1, 1)

            const appointmentsByMonth = await Appointment.findAll({
                attributes: [
                    [fn("DATE_FORMAT", col("scheduledDate"), "%Y-%m"), "month"],
                    [fn("COUNT", "*"), "appointments"],
                ],
                where: {
                    serviceId,
                    status: { [Op.ne]: "cancelled" },
                    scheduledDate: {
                        [Op.gte]: oneYearAgo,
                    },
                },
                group: [fn("DATE_FORMAT", col("scheduledDate"), "%Y-%m")],
                order: [[fn("DATE_FORMAT", col("scheduledDate"), "%Y-%m"), "ASC"]],
                raw: true,
            })

            const revenueByMonth = await Invoice.findAll({
                attributes: [
                    [fn("DATE_FORMAT", col("paymentDate"), "%Y-%m"), "month"],
                    [fn("SUM", col("finalCost")), "revenue"],
                ],
                where: {
                    id: invoiceIds,
                    paymentDate: {
                        [Op.gte]: oneYearAgo,
                    },
                },
                group: [fn("DATE_FORMAT", col("paymentDate"), "%Y-%m")],
                order: [[fn("DATE_FORMAT", col("paymentDate"), "%Y-%m"), "ASC"]],
                raw: true,
            })

            const monthlyTrendsMap = {}

            for (const entry of appointmentsByMonth) {
                monthlyTrendsMap[entry.month] = {
                    month: entry.month,
                    appointments: parseInt(entry.appointments),
                    revenue: 0,
                }
            }

            for (const entry of revenueByMonth) {
                if (!monthlyTrendsMap[entry.month]) {
                    monthlyTrendsMap[entry.month] = {
                        month: entry.month,
                        appointments: 0,
                        revenue: 0,
                    }
                }
                monthlyTrendsMap[entry.month].revenue = parseFloat(entry.revenue)
            }

            const monthlyTrends = Object.values(monthlyTrendsMap)

            return res.json({
                allTimeRevenue: totalRevenue || 0,
                currentMonthRevenue: currentMonthRevenue || 0,
                activeEmployees,
                completedAppointments,
                serviceTypeDistribution,
                monthlyTrends,
            })

        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "Server error", error })
        }
    }
}

module.exports = serviceController;