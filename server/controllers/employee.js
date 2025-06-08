const { AuthUser, Employee, Service } = require('../models')
const bcrypt = require('bcrypt')
const generator = require('generate-password')

const employeeController = {
    createEmployee: async (req, res) => {
        try {
            const serviceId = req.params.serviceId

            const searchedService = await Service.findByPk(serviceId)

            if (!searchedService) {
                return res.status(404).json("This service does not exist")
            }

            const { firstName, lastName } = req.body
            const email = `${firstName}.${lastName}@${searchedService.name}.com`
            const role = 'employee'
            const password = generator.generate({
                length: 16,
                numbers: true,
                symbols: true,
            })
            const hashedPassword = await bcrypt.hash(password, 10)

            const authData = {
                firstName,
                lastName,
                email,
                role,
                password: hashedPassword
            }

            const authResult = await AuthUser.create(authData)
            console.log(authResult)

            const {
                hireDate,
                position,
                experienceLevel,
                salary
            } = req.body

            const isRep = false

            const employeeData = {
                hireDate,
                position,
                experienceLevel,
                salary,
                isRep,
                authUserId: authResult.id,
                serviceId: searchedService.id
            }

            const employeeResult = await Employee.create(employeeData)
            console.log(employeeResult)

            return res.status(200).json({ authResult, employeeResult, password: password })

        } catch (error) {
            res.status(500).json(error.message)
        }
    },
    getEmployeesByService: async (req, res) => {
        try {
            const serviceId = req.params.serviceId;

            const searchedEmployees = await Employee.findAll({ where: { serviceId: serviceId }, include: { model: AuthUser } })

            if (!searchedEmployees) {
                return res.status(404).json("There are no employees for this service at the moment")
            }

            res.status(200).json(searchedEmployees)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    deleteEmployee: async (req, res) => {
        try {
            const {empId} = req.params

            const searchedEmployee = await Employee.findByPk(empId)
            if(!searchedEmployee){
                return res.status(404).json("No employee data found")
            }
            const authUserId = searchedEmployee.authUserId
            const searchedAuthUser = await AuthUser.findByPk(authUserId)
            if(!searchedAuthUser){
                return res.status(404).json("No auth user data found")
            }

            await searchedEmployee.destroy()
            await searchedAuthUser.destroy()
            return res.status(200).json("Employee deleted successfully")


        } catch (error) {
            return res.status(500).json(error)
        }
    },
    updateEmployee: async (req, res) => {
        try {
            const {
                hireDate,
                position,
                experienceLevel,
                salary,
                firstName,
                lastName
            } = req.body

            const searchedEmployee = await Employee.findByPk(req.params.empId, {
                include: { model: AuthUser, as: "auth_user" }
            })

            if (!searchedEmployee) {
                return res.status(404).json("No employee found!")
            }

            await searchedEmployee.update({ hireDate, position, experienceLevel, salary })
            await searchedEmployee.auth_user.update({ firstName, lastName })

            return res.status(200).json("Update successful")
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = employeeController