const userController = require('./user')
const serviceController = require('./service')
const serviceTypeController = require('./serviceType')
const carController = require('./car')
const appointmentController = require('./appointment')
const employeeController = require('./employee')
const repairController = require('./repair')
const favController = require('./favourites')
const feedbackController = require('./feedback')
const invoiceController = require("./invoice")

module.exports = {
    userController,
    serviceController,
    serviceTypeController,
    carController,
    appointmentController,
    employeeController,
    repairController,
    favController,
    feedbackController,
    invoiceController
}