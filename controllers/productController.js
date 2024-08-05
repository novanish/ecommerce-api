const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const getAllProducts = async (_, res) => {
  const products = await Product.find({}).sort("updateAt createdAt");
  res.status(StatusCodes.OK).json({ products });
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }

  return res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res) => {
  const productData = req.body;
  productData.user = req.user.userId;

  const product = await Product.create(productData);
  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }

  const currentlyLoggedInUserId = req.user.userId;
  checkOwnership(product, currentlyLoggedInUserId);

  Object.assign(product, req.body);
  await product.save();

  res.status(StatusCodes.OK).json({ product });
};

const uploadProductImage = async (req, res) => {
  res.send("Upload product image");
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }

  const currentlyLoggedInUserId = req.user.userId;
  checkOwnership(product, currentlyLoggedInUserId);

  await product.deleteOne();
  res.status(StatusCodes.NO_CONTENT).send();
};

function checkOwnership(product, userId) {
  const productOwnerId = product.user.toString();
  const isOwner = userId === productOwnerId;

  if (!isOwner) {
    throw new UnauthorizedError("You are not allowed to delete this product");
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  uploadProductImage,
};
