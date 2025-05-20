const express = require('express')
const router = express.Router()

const serviceRouter = require('./service')
const userRouter = require('./user')
const serviceTypeRouter = require('./serviceType')
const authRouter = require('./checkAuth')
const carRouter = require('./car')
const appointmentRouter = require('./appointment')

router.use('/service', serviceRouter)
router.use('/user', userRouter)
router.use('/serviceType', serviceTypeRouter)
router.use('/car', carRouter)
router.use('/appointment', appointmentRouter)

router.use('/auth', authRouter)

module.exports = router;