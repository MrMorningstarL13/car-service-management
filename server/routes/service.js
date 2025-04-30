const express = require('express')
const router = express.Router();

const { serviceController } = require('../controllers')

router.post('/create', serviceController.create)
router.get('/getAllShops', serviceController.getAll)

module.exports = router