const express = require("express");
const {
  registerUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserProfile,
  updateUserRole,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
} = require("../controller/userController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/getAllUsers").get(getAllUsers);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/updateUserProfile/:id").put(updateUserProfile);
router.route("/updateUserRole/:id").put(updateUserRole);
router.route("/deleteUser/:id").delete(deleteUser);

module.exports = router;
