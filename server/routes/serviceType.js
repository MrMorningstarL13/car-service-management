const express = require('express');
const router = express.Router();
const { serviceTypeController } = require('../controllers')

router.post('/create', serviceTypeController.createServiceType)
router.get('/getAllServiceTypes', serviceTypeController.getAllServiceTypes)

module.exports = router