const express = require("express");

const {
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middlewares/authentication");

const router = express.Router();

router.post("/", authenticateUser, createReview);

router
  .route("/:id")
  .get(getReviewById)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
