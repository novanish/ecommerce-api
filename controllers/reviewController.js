const { StatusCodes } = require("http-status-codes");

const Review = require("../models/Review");
const Product = require("../models/Product");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const UnAuthorizedError = require("../errors/UnAuthorizedError");

const getAllReviews = async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId }).select("-user");

  res.status(StatusCodes.OK).json({ reviews });
};

const getReviewById = async (req, res) => {
  const { id, productId } = req.params;
  const review = await Review.findOne({ _id: id, product: productId }).select(
    "-user"
  );
  if (!review) {
    throw new NotFoundError(`No review with id : ${id}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const createReview = async (req, res) => {
  const product = await Product.findById(req.body.product);
  if (!product) {
    throw new NotFoundError(`No product with id : ${req.body.product}`);
  }

  const { userId } = req.user;
  const existingReview = await Review.findOne({
    product: product._id,
    user: userId,
  });
  if (existingReview) {
    throw new BadRequestError("You have already reviewed this product");
  }

  const review = await Review.create({ ...req.body, user: userId });

  res.status(StatusCodes.CREATED).json({ review });
};

const updateReview = async (req, res) => {
  res.send("Update review");
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw new NotFoundError(`No review with id : ${id}`);
  }

  const currentlyLoggedInUserId = req.user.userId;
  checkReviewOwnership(review, currentlyLoggedInUserId);
  await review.deleteOne();

  res.status(StatusCodes.NO_CONTENT).send();
};

function checkReviewOwnership(review, userId) {
  const reviewOwnerId = review.user.toString();
  const isOwner = reviewOwnerId === userId;

  if (!isOwner) {
    throw new UnAuthorizedError(
      "You are not authorized to perform this action"
    );
  }
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
