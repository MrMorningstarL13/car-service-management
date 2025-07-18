const { Feedback, Service, Appointment, Car, User, AuthUser } = require('../models')

const controller = {
    create: async (req, res) => {
        try {
            const { userId: authUserId, serviceId } = req.params;
            const { rating, comment } = req.body;

            if (!rating || !comment) {
                return res.status(400).json('You must add a rating and a comment!');
            }
            if (rating < 0 || rating > 10) {
                return res.status(400).json('Invalid rating range, please insert a valid rating!');
            }

            const user = await User.findOne({
                where: { authUserId },
                include: {
                    model: AuthUser,
                    attributes: ['firstName', 'lastName']
                }
            });

            if (!user) {
                return res.status(404).json('User not found');
            }

            const cars = await Car.findAll({
                where: { userId: user.id },
                attributes: ['id'],
                include: [{
                    model: Appointment,
                    attributes: ['id'],
                    where: { serviceId }
                }]
            });

            if (cars.length === 0) {
                return res.status(404).json(
                    'No appointments found at this service! Please make an appointment before adding a review.'
                );
            }

            const { firstName, lastName } = user.auth_user;
            const author = `${firstName} ${lastName}`.trim();

            const service = await Service.findByPk(serviceId);
            if (!service) {
                return res.status(404).json('Service not found');
            }

            const feedback = await service.createFeedback({
                rating,
                comment,
                author
            });

            return res.status(201).json(feedback);

        } catch (error) {
            console.error('Error creating feedback:', error);
            return res.status(500).json('Internal server error');
        }
    },

    update: async (req, res) => {
        try {
            const { feedbackId } = req.params;

            const searchedFeedback = await Feedback.findByPk(feedbackId);

            if (!searchedFeedback) {
                return res.status(404).json("No feedback found");
            }

            const { rating, comment } = req.body;

            if (!rating || !comment) {
                return res.status(400).json("You must provide both a rating and a comment!");
            }

            if (rating < 1 || rating > 10) {
                return res.status(400).json("Invalid rating range, please insert a valid rating!");
            }

            searchedFeedback.rating = rating
            searchedFeedback.comment = comment
            await searchedFeedback.save();

            return res.status(200).json(searchedFeedback);
        } catch (error) {
            console.error(error);
            return res.status(500).json("Server error when updating!");
        }
    },

    delete: async (req, res) => {
        try {
            const { feedbackId } = req.params

            const result = await Feedback.destroy({
                where: { id: feedbackId }
            })

            if (result === 0)
                return res.status(400).json("No feedback deleted, please try again")
            return res.status(200).json("Deleted succesfully!")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    getAllByService: async (req, res) => {
        try {
            const { serviceId } = req.params

            const result = await Feedback.findAll({
                where: { serviceId }
            })

            if (result.length === 0)
                return res.status(404).json("No reviews found for this service")
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    getAverage: async (req, res) => {
        try {
            const { serviceId } = req.params

            const ratings = await Feedback.findAll({
                where: { serviceId },
                attributes: ['rating']
            })

            if (!ratings) {
                return res.status(404).json(0)
            }

            const averageRating = ratings.map(el => el.rating).reduce((prev, curr) => prev = prev + curr) / ratings.length

            res.status(200).json(averageRating)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = controller