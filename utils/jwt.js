const jwt = require("jsonwebtoken");

function getOptions(options) {
  const defaultOptions = {
    expiresIn: process.env.JWT_LIFETIME,
  };

  return Object.assign(defaultOptions, options);
}

function createJWT(payload, options) {
  return jwt.sign(payload, process.env.JWT_SECRET, getOptions(options));
}

function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { createJWT, verifyJWT };
