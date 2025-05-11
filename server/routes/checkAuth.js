const express = require("express")
const router = express.Router()
const checkAuth = require("../middlewares/auth/checkAuth")

router.get('/check', checkAuth)

module.exports = router