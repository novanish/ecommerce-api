const mongoose = require("mongoose");

const { ORDER_STATUS } = require("../utils/constants");

const orderItemSchema = new mongoose.Schema({
  product: {
    ref: "Product",
    type: mongoose.Types.ObjectId,
    required: [true, "Please provide order item product"],
  },

  quantity: {
    type: Number,
    required: [true, "Please provide order item quantity"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderItems: {
      type: [orderItemSchema],
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
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1 });

orderSchema.methods.toJSON = function () {
  const order = this.toObject();
  order.id = order._id;

  delete order._id;
  delete order.__v;

  return order;
};

module.exports = mongoose.model("Order", orderSchema);
