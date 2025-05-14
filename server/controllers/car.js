const { User } = require('../models');
const { Car } = require('../models');
const axios = require('axios');

const CUSTOM_SEARCH_API_KEY =  'AIzaSyDdVkqy-pvJS12ERY2hVbcbQM6KfE7MJwo' 
const SEARCH_ENGINE_ID = '262303ae0aceb464d';

const carController = {
    create: async (req, res) => {
        try {
            const searchedUser = await User.findByPk(req.params.userId);

            const data = req.body;
            const createdCar = await Car.create(data);

            const isOk = await searchedUser.addCar(createdCar);
            if (isOk) {
                res.status(200).json(createdCar);
            } else {
                res.status(400).json('Failed to create car.');
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllByUserId: async (req, res) => {
        try {

            const userId = req.params.userId;
            const searchedUser = await User.findByPk(userId);
            if (!searchedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const cars = await Car.findAll({
                where: { userId: userId },
            });

            if (cars.length === 0) {
                return res.status(404).json({ message: "No cars found for this user" });
            }

            res.status(200).json(cars);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteById: async (req, res) => {
        try {
            const carId = req.params.carId;
            const deletedCar = await Car.destroy({
                where: { id: carId },
            });

            if (!deletedCar) {
                return res.status(404).json({ message: "Car not found" });
            }

            res.status(200).json({ message: "Car deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getImage: async (req, res) => {
        try {
            const { brand, model, yearOfProduction } = req.query;
            if (!brand || !model || !yearOfProduction) {
                return res.status(400).json({ message: "Brand, model and production year are required" });
            }
            
            const query = `${brand} ${model} ${yearOfProduction} car desktop wallpaper`;
            
            const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
                params: {
                    q: query,
                    cx: SEARCH_ENGINE_ID,
                    key: CUSTOM_SEARCH_API_KEY,
                    searchType: 'image',
                    num: 1,
                },
            })

            const imageUrl = response.data.items[0]?.link;
            console.warn(imageUrl);

            if (!imageUrl) {
                return res.status(404).json({ message: "No image found" });
            } else return res.status(200).json({ imageUrl });

        } catch (error) {
            return res.status(500).json(error.message);
        }
    },
}

module.exports = carController;