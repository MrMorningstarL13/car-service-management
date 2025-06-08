const express = require("express")
const router = express.Router()
const { repairController } = require("../controllers")

router.post("/create/:appointmentId/:serviceTypeId", repairController.createRepair)
router.post("/assign", repairController.assignRepair)

module.exports = router