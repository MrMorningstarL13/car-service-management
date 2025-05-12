const express = require('express');
const router = express.Router();
const { carController } = require('../controllers');

router.post('/create/:userId', carController.create);
router.get('/getByUser/:userId', carController.getAllByUserId);
router.delete('/delete/:carId', carController.deleteById);
router.get('/search', carController.getImage);

module.exports = router;