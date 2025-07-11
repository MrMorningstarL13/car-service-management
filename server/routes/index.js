const express = require('express')
const router = express.Router()

const serviceRouter = require('./service')
const userRouter = require('./user')
const serviceTypeRouter = require('./serviceType')
const authRouter = require('./checkAuth')
const carRouter = require('./car')
const appointmentRouter = require('./appointment')
const employeeRouter = require('./employee')
const repairRouter = require('./repair')
const favouriteRouter = require('./favourites')
const feedbackRouter = require('./feedback')
const invoiceRouter = require('./invoice')

router.use('/service', serviceRouter)
router.use('/user', userRouter)
router.use('/serviceType', serviceTypeRouter)
router.use('/car', carRouter)
router.use('/appointment', appointmentRouter)
router.use('/employee', employeeRouter)
router.use('/repair', repairRouter)
router.use('/favourite', favouriteRouter)
router.use('/feedback', feedbackRouter)
router.use('/payment', invoiceRouter)

router.use('/auth', authRouter)

module.exports = router;