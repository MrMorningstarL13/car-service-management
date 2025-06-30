const express = require('express')
const { feedbackController } = require('../controllers')
const router = express.Router()

router.post('/create/:userId/:serviceId', feedbackController.create)
router.delete('/delete/:feedbackId', feedbackController.delete)
router.patch('/update/:feedbackId', feedbackController.update)
router.get('/getAll/:serviceId', feedbackController.getAllByService)

module.exports = router