const express = require('express');
const router = express.Router();
const { carController } = require('../controllers');

router.post('/:userId', carController.create);
router.get('/:userId', carController.getAllByUserId);

module.exports = router;