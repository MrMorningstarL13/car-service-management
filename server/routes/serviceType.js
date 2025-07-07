const express = require('express');
const router = express.Router();
const { serviceTypeController } = require('../controllers')

router.post('/create/:serviceId', serviceTypeController.createServiceType)
router.get('/getAllServiceTypes', serviceTypeController.getAllServiceTypes)
router.get('/getByShop/:serviceId', serviceTypeController.getServiceTypesByShop)
router.get('/getName/:serviceTypeId', serviceTypeController.getServiceTypeName)
router.patch('/update/:serviceTypeId', serviceTypeController.update)
router.delete('/delete/:serviceTypeId', serviceTypeController.delete)

module.exports = router