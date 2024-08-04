const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const UnAuthenticatedError = require("../errors/UnAuthenticatedError");
const { TOKEN_COOKIE_OPTIONS } = require("../utils/constants");

const getAllUsers = async (req, res) => {
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
  const { userId } = req.user;

  const currenUser = await User.findById(userId).select(
    "-createdAt -updatedAt"
  );
  res.status(StatusCodes.OK).json({ me: currenUser });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { userId } = req.user;
  if (!name && !email) {
    throw new BadRequestError('Provide "name" or "email" to update');
  }

  if (email && (await User.doesUserExistsWithEmail(email))) {
    throw new BadRequestError("User with this email already exists");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true }
  );
  const token = user.createJWT();

  res.cookie("token", token, TOKEN_COOKIE_OPTIONS);
  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req.user;
  if (!currentPassword || !newPassword) {
    throw new BadRequestError(
      'Please provide "currentPassword" and "newPassword"'
    );
  }

  const user = await User.findById(userId).select("+password");
  const isPasswordValid = await user.verifyPassword(currentPassword);
  if (!isPasswordValid) {
    throw new UnAuthenticatedError("Invalid password");
  }

  await User.findByIdAndUpdate(userId, { password: newPassword });

  res.status(StatusCodes.OK).json({ message: "Password updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
