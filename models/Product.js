const mongoose = require("mongoose");
const { PRODUCT_CATEGORIES } = require("../utils/constants");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Product name must be at most 100 characters"],
      required: [true, "Please provide product name"],
    },

    price: {
      type: Number,
      min: [0, "Price must be a positive number"],
      required: [true, "Please provide product price"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Product description must be at most 1000 characters"],
      required: [true, "Please provide product description"],
    },

    image: {
      type: String,
      trim: true,
      default: "no-photo.jpg",
    },

    category: {
      type: String,
      trim: true,
      required: [true, "Please provide product category"],
      enum: {
        values: Object.values(PRODUCT_CATEGORIES),
        message: "Invalid category: {VALUE}",
      },
    },

    company: {
      type: String,
      trim: true,
      required: [true, "Please provide product company"],
    },

    colors: {
      type: [String],
      trim: true,
      required: [true, "Please provide product colors"],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      min: [0, "Inventory must be a positive number"],
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, 'Please provide product owner "user"'],
    },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const product = this.toObject();
  product.id = product._id;

  delete product.__v;
  delete product._id;

  return product;
};

module.exports = mongoose.model("Product", productSchema);
