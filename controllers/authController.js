const { StatusCodes } = require("http-status-codes");
const ms = require("ms");

const User = require("../models/User");
const BadRequestError = require("../errors/BadRequestError");
const UnAuthenticatedError = require("../errors/UnAuthenticatedError");
const { TOKEN_COOKIE_OPTIONS } = require("../utils/constants");

const register = async (req, res) => {
  const { role, ...user } = req.body;

  const emailAlreadyExists = await User.doesUserExistsWithEmail(user.email);
  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }

  const createdUser = await User.create(user);
  const token = createdUser.createJWT();

  res.cookie("token", token, TOKEN_COOKIE_OPTIONS);
  res.status(StatusCodes.CREATED).json({ user: createdUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid email or password");
  }

  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    throw new UnAuthenticatedError("Invalid email or password");
  }

  const token = user.createJWT();

  res.cookie("token", token, TOKEN_COOKIE_OPTIONS);
  res.status(StatusCodes.OK).json({ user });
};

const logout = (_, res) => {
  const expiredDate = new Date(Date.now() - ms("1m"));
  res.cookie("token", "", { expires: expiredDate });
  res.status(StatusCodes.OK).send("Logout successful");
};

module.exports = {
  register,
  login,
  logout,
};
