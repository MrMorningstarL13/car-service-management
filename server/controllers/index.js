const userController = require('./user')
const serviceController = require('./service')
const serviceTypeController = require('./serviceType')
const carController = require('./car')
const car = require('../models/car')

module.exports = {
    userController,
    serviceController,
    serviceTypeController,
    carController,
}