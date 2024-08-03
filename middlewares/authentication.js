const UnAuthenticatedError = require("../errors/UnAuthenticatedError");
const UnAuthorizedError = require("../errors/UnAuthorizedError");
const { USER_ROLES } = require("../utils/constants");
const { verifyJWT } = require("../utils/jwt");

function authenticateUser(req, _, next) {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnAuthenticatedError("Authentication required");
  }

  try {
    const payload = verifyJWT(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Invalid token");
  }
}

function ensureRole(...roles) {
  return (req, _, next) => {
    const user = req.user;
    if (!roles.includes(user.userRole)) {
      throw new UnAuthorizedError("Access denied");
    }

    next();
  };
}

module.exports = { authenticateUser, ensureRole };
