const express = require('express')
const router = express.Router();

const { serviceController } = require('../controllers')

router.post('/create', serviceController.create)
router.post('/getAllShops', serviceController.getAll)
router.get('/getServiceById/:serviceId', serviceController.getById)
router.post('/addServiceType/:shopId/:serviceTypeName', serviceController.addServiceTypeToShop)
router.patch('/update/:serviceId', serviceController.update)
router.get('/getStats/:serviceId', serviceController.getRepresentativeStatistics)

module.exports = router