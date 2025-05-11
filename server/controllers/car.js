const { User } = require('../models');
const Car = require('../models/car');

const carController = {
    create: async (req, res) => {
        try {
            const car = req.body;

            await Car.create(car);

            res.status(201).json(car);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllPerUser: async (req, res) => {
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
    }
}