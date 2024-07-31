const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error" });
};

module.exports = errorHandler;
