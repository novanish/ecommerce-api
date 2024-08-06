const express = require("express");

const {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middlewares/authentication");

const router = express.Router();

router.route("/").get(getAllReviews).post(authenticateUser, createReview);
router
  .route("/:id")
  .get(getReviewById)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
