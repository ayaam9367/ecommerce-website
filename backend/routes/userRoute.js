const express = require("express");
const {registerUser, getAllUsers, getSingleUser, updateUser, deleteUser} = require("../controller/userController");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/getAllUsers").get(getAllUsers);
router.route("/getUser/:id").get(getSingleUser);
router.route("/updateUser/:id").put(updateUser);
router.route("/deleteUser/:id").delete(deleteUser);

module.exports = router;