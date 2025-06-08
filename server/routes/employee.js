const express = require("express")
const { employeeController } = require("../controllers")
const router = express.Router()

router.post("/create/:serviceId", employeeController.createEmployee)
router.get("/getAllByShop/:serviceId", employeeController.getEmployeesByService)
router.put("/update/:empId", employeeController.updateEmployee)
router.delete("/delete/:empId", employeeController.deleteEmployee)

module.exports = router