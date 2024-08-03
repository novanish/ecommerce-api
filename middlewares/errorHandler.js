const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/CustomAPIError");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error" });
};

module.exports = errorHandler;
