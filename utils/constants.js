const ms = require("ms");

const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  expires: new Date(Date.now() + ms("1d")),
  signed: true,
};

const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const PRODUCT_CATEGORIES = {
  OFFICE: "Office",
  KITCHEN: "Kitchen",
  BEDROOM: "Bedroom",
};

module.exports = { TOKEN_COOKIE_OPTIONS, USER_ROLES, PRODUCT_CATEGORIES };
