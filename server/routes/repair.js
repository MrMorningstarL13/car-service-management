const express = require("express")
const router = express.Router()
const { repairController } = require("../controllers")

router.post("/create/:appointmentId/:serviceTypeId", repairController.createRepair)
router.post("/assign/:repairId/:employeeId", repairController.assignRepair)
router.post("/complete/:repairId", repairController.completeRepair)

module.exports = router