const express = require("express");
const {
  registerUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserProfile,
  updateUserRole,
} = require("../controller/userController");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/getAllUsers").get(getAllUsers);
router.route("/getUser/:id").get(getSingleUser);
router.route("/updateUserProfile/:id").put(updateUserProfile);
router.route("/updateUserRole/:id").put(updateUserRole);
router.route("/deleteUser/:id").delete(deleteUser);

module.exports = router;
