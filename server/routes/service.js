const express = require('express')
const router = express.Router();

const { serviceController } = require('../controllers')

router.post('/create', serviceController.create)
router.post('/getAllShops', serviceController.getAll)
router.get('/getServiceById', serviceController.getById)
router.post('/addServiceType/:shopId/:serviceTypeName', serviceController.addServiceTypeToShop)

module.exports = router