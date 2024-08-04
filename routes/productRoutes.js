const express = require("express");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  uploadProductImage,
} = require("../controllers/productController");
const {
  authenticateUser,
  ensureRole,
} = require("../middlewares/authentication");
const { USER_ROLES } = require("../utils/constants");

const router = express.Router();
const adminAuthMiddleware = [authenticateUser, ensureRole(USER_ROLES.ADMIN)];

router.route("/").get(getAllProducts).post(adminAuthMiddleware, createProduct);
router.post("/upload-image", adminAuthMiddleware, uploadProductImage);

router
  .route("/:id")
  .get(getProductById)
  .patch(adminAuthMiddleware, updateProduct)
  .delete(adminAuthMiddleware, deleteProduct);

module.exports = router;
