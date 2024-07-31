const CustomAPIError = require("./CustomAPIError");

class UnAuthorizedError extends CustomAPIError {
  constructor(message) {
    super(message, 401);
  }
}

module.exports = UnAuthorizedError;
