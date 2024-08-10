const crypto = require("node:crypto");

const { StatusCodes } = require("http-status-codes");

const { USER_ROLES, ORDER_STATUS } = require("../utils/constants");
const Order = require("../models/Order");
const Product = require("../models/Product");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const UnAuthorizedError = require("../errors/UnAuthorizedError");

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).sort("-updatedAt -createdAt");
  res.status(StatusCodes.OK).json({ orders });
};

const getCurrentUserOrders = async (req, res) => {
  const { userId } = req.user;
  const orders = await Order.find({ user: userId }).sort(
    "-updatedAt -createdAt"
  );

  console.log(await Order.find({}));
  res.status(StatusCodes.OK).json({ orders });
};

const getOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError(`Order with id ${orderId} not found`);
  }

  const currentlyLoggedInUser = req.user;
  const isCurrentUserAdmin = currentlyLoggedInUser.role === USER_ROLES.ADMIN;
  if (
    isCurrentUserAdmin ||
    checkOwnership(order, currentlyLoggedInUser.userId)
  ) {
    throw new UnAuthorizedError(
      "You do not have permission to perform this action"
    );
  }

  res.status(StatusCodes.OK).json({ order });
};

const createOrder = async (req, res) => {
  const { orderItems } = req.body;

  const orders = [];
  let subTotal = 0;
  let shippingFee = 0;
  let tax = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new NotFoundError(`Product with id ${item.product} not found`);
    }

    if (product.inventory < item.quantity) {
      throw new BadRequestError(
        `Product with id ${item.product} is out of stock. Only ${product.inventory} left`
      );
    }

    const orderAmount = product.price * item.quantity;

    subTotal += orderAmount;
    shippingFee += product.shippingFee;
    tax += orderAmount * (product.tax / 100);
    orders.push({
      product: item.product,
      quantity: item.quantity,
    });

    product.inventory -= item.quantity;
    await product.save();
  }

  const total = subTotal + shippingFee + tax;
  const { clientSecret } = await fakeStripePayment({
    amount: total * 100,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems: orders,
    subTotal,
    shippingFee,
    tax,
    total,
    user: req.user.userId,
    clientSecret,
  });

  res.status(StatusCodes.CREATED).json({ order });
};

const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { paymentIntentId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError(`Order with id ${id} not found`);
  }

  const currentlyLoggedInUserId = req.user.userId;
  checkOwnership(order, currentlyLoggedInUserId);

  order.paymentIntentId = paymentIntentId;
  order.status = ORDER_STATUS.PAID;
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

function checkOwnership(order, userId) {
  const orderUserId = order.user.toString();
  const isOwner = orderUserId === userId;
  if (!isOwner) {
    throw new UnAuthorizedError(
      "You do not have permission to perform this action"
    );
  }
}

async function fakeStripePayment({ amount, currency }) {
  return new Promise((resolve) => {
    const clientSecret = crypto.randomBytes(20).toString("hex");
    resolve({ clientSecret, amount, currency });
  });
}

module.exports = {
  getAllOrders,
  getCurrentUserOrders,
  getOrder,
  createOrder,
  updateOrder,
};
