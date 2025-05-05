const express = require('express')
const router = express.Router()

const serviceRouter = require('./service')
const userRouter = require('./user')

router.use('/service', serviceRouter)
router.use('/user', userRouter)

module.exports = router;