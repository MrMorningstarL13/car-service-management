const express = require('express');
const router = express.Router();
const { userController } = require('../controllers')

router.post('/signUp', userController.createUser)
router.post('/logIn', userController.logIn)
router.post('/logOut', userController.logOut)
router.get('/getAllUsers', userController.getAllUsers)
router.get('/statistics/:userId', userController.getStatistics)

module.exports = router