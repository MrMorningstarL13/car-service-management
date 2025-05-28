const { User, AuthUser, Employee, Service } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('../config/db')

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

const userController = {
    createUser: async (req, res) => {

        const t = await sequelize.transaction();

        try {
            const {
                firstName,
                lastName,
                email,
                role,
            } = req.body

            const existingUser = await AuthUser.findOne({ where: { email: email } }, {transaction: t})
            if (existingUser) {
                return res.status(409).json("A user already exists with this email")
            }

            const password = req.body.password
            const hashedPassword = await bcrypt.hash(password, 10)

            const authUserData = {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
            }
            const createdAuthUser = await AuthUser.create(authUserData, {transaction: t})
            let createdEntity = null;

            if (role === 'customer') {
                const {
                    dateOfBirth,
                    phone,
                } = req.body

                const userData = {
                    dateOfBirth,
                    phone,
                }

                const createdUser = await createdAuthUser.createUser(userData, {transaction: t})

                if (createdUser)
                    createdEntity = createdUser
                else {
                    return res.status(500).json("error when creating user")
                }

            } else {
                const {
                    hireDate,
                    position,
                    experienceLevel,
                    salary,
                    isRep,
                    serviceId
                } = req.body

                const employeeData = {
                    hireDate,
                    position,
                    experienceLevel,
                    salary,
                    isRep,
                    serviceId
                }

                const isServiceValid = await Service.findByPk(serviceId)

                if (!isServiceValid) {
                    return res.status(404).json("Cannot create employee for inexistent service")
                }

                const createdEmployee = await createdAuthUser.createEmployee(employeeData, {transaction: t})

                if (createdEmployee)
                    createdEntity = createdEmployee
                else {
                    return res.status(500).json("error when creating employee")
                }
            }

            const token = jwt.sign({ id: createdAuthUser.id }, JWT_SECRET, {
                expiresIn: '4h'
            })

            if (createdAuthUser && createdEntity) {
                await t.commit();

                return res.cookie("bearer", token, {
                    maxAge: 4 * 60 * 60 * 1000,
                    httpOnly: true,
                }).status(200).json({ user: { createdAuthUser, createdEntity } })
            } else {
                return res.status(418).json("error when creating cookie")
            }

        } catch (error) {
            await t.rollback()
            return res.status(500).json(error.message)
        }
    },

    logIn: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email: email } })

            if (!user) {
                return res.status(404).json("User not found")
            } else {
                const isPasswordCorrect = await bcrypt.compare(password, user.password)

                if (!isPasswordCorrect) {
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
            return res.status(500).json("Error when logging in")
        }
    },

    logOut: async (req, res) => {
        try {
            res.clearCookie("bearer", {
                httpOnly: true,
            }).status(200).json("User logged out")
        } catch (error) {
            return res.status(500).json("Error when logging out")
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll()

            if (users.length === 0) {
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