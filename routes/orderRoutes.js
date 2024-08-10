const express = require("express");

const {
  authenticateUser,
  ensureRole,
} = require("../middlewares/authentication");
const { USER_ROLES } = require("../utils/constants");
const {
  getAllOrders,
  getCurrentUserOrders,
  createOrder,
  getOrder,
  updateOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.use(authenticateUser);

router
  .route("/")
  .get(ensureRole(USER_ROLES.ADMIN), getAllOrders)
  .post(createOrder);
router.get("/my-orders", getCurrentUserOrders);
router.route("/:id").get(getOrder).patch(updateOrder);

module.exports = router;
