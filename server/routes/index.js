const express = require('express')
const router = express.Router()

const serviceRouter = require('./service')
const userRouter = require('./user')
const serviceTypeRouter = require('./serviceType')

router.use('/service', serviceRouter)
router.use('/user', userRouter)
router.use('/serviceType', serviceTypeRouter)

module.exports = router;