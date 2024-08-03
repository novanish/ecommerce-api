const ms = require("ms");

const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  expires: new Date(Date.now() + ms("1d")),
  signed: true,
};

module.exports = { TOKEN_COOKIE_OPTIONS };
