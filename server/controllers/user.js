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
                expiresIn: '4h'
            })

            
            if(createdUser){

                res.cookie("bearer", token, {
                    maxAge: 4 * 60 * 60 * 1000,
                    httpOnly: true,
                }).status(200).json(createdUser)

            } else {
                res.status(500).json("received user is not ok")
            }
        } catch (error) {
            console.warn("error when creating a user")
        }
    },

    logIn: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email: email } })

            if(!user) {
                return res.status(404).json("User not found")
            } else {
                const isPasswordCorrect = await bcrypt.compare(password, user.password)

                if(!isPasswordCorrect) {
                    return res.status(401).json("Password is incorrect")
                } else {
                    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
                        expiresIn: '4h'
                    })

                    res.cookie("bearer", token, {
                        maxAge: 4 * 60 * 60 * 1000,
                        httpOnly: true,
                    }).status(200).json(user)

                }
            }
        } catch (error) {
            console.warn("Error when logging in")
        }
     },

     logOut: async (req, res) => {
        try {
            res.clearCookie("bearer", {
                httpOnly: true,
            }).status(200).json("User logged out")
        } catch (error) {
            console.warn("Error when logging out")
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