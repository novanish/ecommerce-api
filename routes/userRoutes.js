const express = require("express");

const {
  updateUser,
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
} = require("../controllers/userController");
const {
  authenticateUser,
  ensureRole,
} = require("../middlewares/authentication");
const { USER_ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authenticateUser);

router.route("/").get(ensureRole(USER_ROLES.ADMIN), getAllUsers);
router.route("/me").get(showCurrentUser);
router.route("/:id").get(getSingleUser);
router.route("/update-user").patch(updateUser);
router.route("/update-password").patch(updateUserPassword);

module.exports = router;
