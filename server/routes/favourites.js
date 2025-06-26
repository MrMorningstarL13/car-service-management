const epxress = require('express')
const router = epxress.Router();
const {favController} = require("../controllers")

router.post("/add/:userId/:serviceId", favController.addToFavourites)
router.delete("/remove/:userId/:serviceId", favController.removeFromFavourites)
router.get("/getByUser/:userId", favController.getFavouritesForUser)

module.exports = router