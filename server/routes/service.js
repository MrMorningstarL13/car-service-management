const express = require('express')
const router = express.Router();

const { serviceController } = require('../controllers')

router.post('/create', serviceController.create)
router.get('/getAllShops', serviceController.getAll)
router.get('/getServiceById', serviceController.getById)

module.exports = router