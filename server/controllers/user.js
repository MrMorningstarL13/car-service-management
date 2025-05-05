const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Cookies = require('js-cookie')

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

const userController = {
    createUser: async (req, res) => {
        try {
            const data = req.body

            const {password} = data
            const hashedPassword = await bcrypt.hash(password, 10)
            data.password = hashedPassword
            const createdUser = await User.create(data)

            const token = jwt.sign({ id: createdUser.id }, JWT_SECRET, {
                expiresIn: '2h'
            })

            const cookieName = `${createdUser.id}-token`

            if(createdUser){
                Cookies.set(cookieName, token, { expires: 1/12 })
                res.status(200).json(token)
            } else {
                res.status(500).json("received user is not ok")
            }
        } catch (error) {
            console.warn("error when creating a user")
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll()

            if(users.length === 0){
                res.status(404).json("There are no users.")
            } else {
                res.status(200).json(users)
            }
        } catch (error) {
            res.status(500).json("There was an error when retrieving the users.")
        }
    }
}

module.exports = userController