const express = require('express')
const router = express.Router()

const serviceRouter = require('./service')
const userRouter = require('./user')
const serviceTypeRouter = require('./serviceType')
const authRouter = require('./checkAuth')
const carRouter = require('./car')
const car = require('../models/car')

router.use('/service', serviceRouter)
router.use('/user', userRouter)
router.use('/serviceType', serviceTypeRouter)
router.use('/car', carRouter)

router.use('/auth', authRouter)

module.exports = router;