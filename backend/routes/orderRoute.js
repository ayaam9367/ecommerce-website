const express = require("express");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

const { newOrder } = require("../controller/orderController");
const router = express.Router();
router.route("/order/new").post(isAuthenticatedUser, newOrder);

module.exports = router;