const mongoose = require("mongoose");

const { ORDER_STATUS } = require("../utils/constants");

const cartItemSchema = new mongoose.Schema({
  product: {
    ref: "Product",
    type: mongoose.Types.ObjectId,
    required: [true, "Please provide cart item product"],
  },

  qunatity: {
    type: Number,
    required: [true, "Please provide cart item quantity"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderItems: {
      type: [cartItemSchema],
      required: [true, "Please provide order items"],
    },

    tax: {
      type: Number,
      required: [true, "Please provide tax"],
    },

    shippingFee: {
      type: Number,
      required: [true, "Please provide shipping fee"],
    },

    subTotal: {
      type: Number,
      required: [true, "Please provide sub total"],
    },

    total: {
      type: Number,
      required: [true, "Please provide total"],
    },

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },

    user: {
      ref: "User",
      type: mongoose.Types.ObjectId,
      required: [true, 'Please provide order owner "user"'],
    },

    clientSecret: {
      type: String,
      required: [true, "Please provide client secret"],
    },

    paymentIntentId: {
      type: String,
      required: [true, "Please provide payment intent id"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
