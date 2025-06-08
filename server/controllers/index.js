const userController = require('./user')
const serviceController = require('./service')
const serviceTypeController = require('./serviceType')
const carController = require('./car')
const appointmentController = require('./appointment')
const employeeController = require('./employee')
const repairController = require('./repair')

module.exports = {
    userController,
    serviceController,
    serviceTypeController,
    carController,
    appointmentController,
    employeeController,
    repairController
}