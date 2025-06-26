const { Favourite, User, Service } = require('../models')

const favController = {
    addToFavourites: async(req, res) => {
        try {
            const {userId, serviceId} = req.params;

            const user = await User.findByPk(userId)
            const service = await Service.findByPk(serviceId)

            if(!user || !service)
                return res.status(404).json("No user or service found!")

            const result = await user.addService(service)
            if(result != null)
                return res.status(201).json(result)
            else
                return res.status(400).json("Service is already a favourite")

        } catch (error) {
            return res.status(500).json(error)
        }
    },
    removeFromFavourites: async(req, res) => {
        try {
            const {userId, serviceId} = req.params;

            const user = await User.findByPk(userId)
            const service = await Service.findByPk(serviceId)

            if(!user || !service)
                return res.status(404).json("No user or service found!")

            const result = await user.removeService(service)
            if(result !== 0)
                return res.status(200).json(result)
            else    
                return res.status(400).json("Service was already removed from favourites")
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    getFavouritesForUser: async(req, res) => {
        try {
            const {userId} = req.params;

            const favouriteServices = await Favourite.findAll({
                where: {
                    userId: userId
                }
            })

            if(favouriteServices.length !== 0)
                return res.status(201).json(favouriteServices)
            else
                return res.status(404).json("There are no services added to favourites yet!")
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = favController