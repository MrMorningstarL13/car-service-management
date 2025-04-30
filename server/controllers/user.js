const { User } = require('../models')

const userController = {
    createUser: async (req, res) => {
        try {
            const data = req.body
            const createdUser = await User.create(data)

            if(createdUser){
                res.status(200).json(createdUser)
            } else {
                res.status(500).json("received user is no ok")
            }
        } catch (error) {
            console.warn("error when creating a user")
        }
    }
}

module.exports = userController