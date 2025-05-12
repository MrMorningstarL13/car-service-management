const { User } = require('../models');
const { Car } = require('../models');

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
}

module.exports = carController;