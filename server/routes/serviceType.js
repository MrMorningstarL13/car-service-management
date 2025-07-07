const express = require('express');
const router = express.Router();
const { serviceTypeController } = require('../controllers')

router.post('/create', serviceTypeController.createServiceType)
router.get('/getAllServiceTypes', serviceTypeController.getAllServiceTypes)
router.get('/getByShop/:serviceId', serviceTypeController.getServiceTypesByShop)
router.get('/getName/:serviceTypeId', serviceTypeController.getServiceTypeName)

module.exports = router