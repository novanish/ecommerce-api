const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Review title must be at most 100 characters"],
      required: [true, "Please provide a title for the review"],
    },

    comment: {
      type: String,
      trim: true,
      required: [true, "Please provide a comment for the review"],
    },

    rating: {
      type: Number,
      min: [0, "Please provide a rating between 0 and 5"],
      max: [5, "Please provide a rating between 0 and 5"],
      required: [true, "Please provide a rating for the review"],
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, 'Please provide review owner "user"'],
    },

    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, 'Please provide review "product"'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
