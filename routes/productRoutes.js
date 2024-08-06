const express = require("express");
const fileUpload = require("express-fileupload");

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

const fileUploadMiddleware = fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  responseOnLimit: "File size limit has been reached",
});

router.route("/").get(getAllProducts).post(adminAuthMiddleware, createProduct);
router.post(
  "/upload-image",
  fileUploadMiddleware,
  adminAuthMiddleware,
  uploadProductImage
);

router
  .route("/:id")
  .get(getProductById)
  .patch(adminAuthMiddleware, updateProduct)
  .delete(adminAuthMiddleware, deleteProduct);

module.exports = router;
