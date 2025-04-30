const express = require('express')
const router = express.Router()

const serviceRouter = require('./service')

router.use('/service', serviceRouter)

module.exports = router;