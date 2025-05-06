const express = require('express');
const router = express.Router();
const { userController } = require('../controllers')

router.post('/signUp', userController.createUser)
router.post('/logIn', userController.logIn)
router.get('/getAllUsers', userController.getAllUsers)

module.exports = router