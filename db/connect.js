const mongoose = require("mongoose");

const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing");
}

function connectDB() {
  return mongoose.connect(MONGO_URI);
}

module.exports = connectDB;
