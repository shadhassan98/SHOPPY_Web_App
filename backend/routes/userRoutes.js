const express = require("express");
const {
  registerNewUser,
  getuserDetails,
  logout,
  loginUser,
  getAllUser,
  deleteUser,
} = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerNewUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logout);

router.route("/me").get(isAuthenticatedUser, getuserDetails);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
