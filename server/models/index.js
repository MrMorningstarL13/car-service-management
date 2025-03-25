const db = require('../config/db')

const appointmentModel = require('./appointment')(db)
const carModel = require('./car')(db)
const employeeModel = require('./employee')(db)
const feedbackModel = require('./feedback')(db)
const invoiceModel = require('./invoice')(db)
const partModel = require('./part')(db)
const requestModel = require('./request')(db)
const serviceModel = require('./service')(db)
const servicePartModel = require('./servicePart')(db)
const serviceTypeModel = require('./serviceType')(db)
const supplierModel = require('./supplier')(db)
const userModel = require('./user')(db)
const repairModel = require('./repair')(db)

//user-car


//car-appointment


//invoice-appointment


//service-appointment


//appointment-employee-serviceType


//repair-feedback


//employee-request


//repair-part


//part-supplier