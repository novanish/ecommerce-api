const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const NotFoundError = require("../errors/NotFoundError");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find();
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.send("Current User");
};

const updateUser = async (req, res) => {
  res.send("Update User");
};

const updateUserPassword = async (req, res) => {
  res.send("Update User Password");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
