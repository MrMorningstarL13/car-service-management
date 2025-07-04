const { User, AuthUser, Employee, Service, Car, Appointment } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('../config/db')
const generator = require('generate-password')

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

            const existingUser = await AuthUser.findOne({ where: { email: email } }, { transaction: t })
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
            const createdAuthUser = await AuthUser.create(authUserData, { transaction: t })
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

                const createdUser = await createdAuthUser.createUser(userData, { transaction: t })

                if (createdUser)
                    createdEntity = createdUser
                else {
                    await t.rollback()
                    return res.status(500).json("error when creating customer")
                }

            } else {
                const {
                    hireDate,
                    position,
                    experienceLevel,
                    salary,
                    isRep,
                } = req.body

                const employeeData = {
                    hireDate,
                    position,
                    experienceLevel,
                    salary,
                    isRep,
                }

                const createdEmployee = await createdAuthUser.createEmployee(employeeData, { transaction: t })

                if (createdEmployee)
                    createdEntity = { createdEmployee }
                else {
                    await t.rollback()
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
                await t.rollback()
                return res.status(418).json("error when creating complete user")
            }

        } catch (error) {
            await t.rollback()
            return res.status(500).json(error.message)
        }
    },

    logIn: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await AuthUser.findOne({ where: { email: email }, include: { model: Employee || User } })

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
            return res.status(500).json(error.message)
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
    },

    getStatistics: async (req, res) => {
        try {
            /* 
            spending distribution by car
            */
            const { userId } = req.params

            const searchedUser = await User.findByPk(
                userId,
                {
                    attributes: ['id'],
                    include: {
                        model: Car,
                        attributes: ['brand', 'model', 'yearOfProduction', 'plateNumber'],
                        include: {
                            model: Appointment,
                            attributes: ['scheduledDate', 'estimatedCost', 'status']
                        }
                    }
                }
            )

            const cars = searchedUser.cars

            const appointments = cars.map(el => el.appointments)
            const totalCost = appointments.flat().map(el => el.estimatedCost).reduce((a, b) => a + b)

            const noAppointments = appointments.flat().length

            const averageCost = totalCost / noAppointments

            let averageCostByCar = {}
            let costByCar = {}

            cars.forEach(car => {
                let carName = `${car.yearOfProduction} ${car.brand} ${car.model}`;

                let appointmentsByCar = car.appointments.map(el => el.estimatedCost)
                let noAppointments = appointmentsByCar.flat().length
                let totalCost = appointmentsByCar.reduce((a, b) => a + b)
                let averageCost = totalCost / noAppointments


                averageCostByCar[carName] = averageCost

                costByCar[carName] = totalCost
            })

            let spendingByCar = {};

            cars.forEach(car => {
                let carName = `${car.yearOfProduction} ${car.brand} ${car.model}`;
                let carSpending = {};

                car.appointments.forEach(appointment => {
                    let year = new Date(appointment.scheduledDate).getFullYear();
                    let cost = Number(appointment.estimatedCost);

                    if (!carSpending[year]) {
                        carSpending[year] = 0;
                    }

                    carSpending[year] += cost;
                });

                spendingByCar[carName] = carSpending;
            });

            cars.forEach(car => {
                console.log(car)
            })

            const result = {
                totalCost,
                averageCost,
                averageCostByCar,
                spendingByCar,
                costByCar
            }

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
}

module.exports = userController