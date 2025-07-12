const express = require("express")
const router = express.Router()
const { repairController } = require("../controllers")

router.post("/create/:appointmentId/:serviceTypeId", repairController.createRepair)
router.patch("/assign/:repairId/:employeeId", repairController.assignEmployeeToRepair)
router.post("/complete/:repairId", repairController.completeRepair)
router.get('/getByEmployee/:employeeId', repairController.getRepairsByEmployee)

module.exports = router