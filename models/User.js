const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: [1, "Name must be at least 1 character"],
      maxlength: [32, "Name must be at most 32 characters"],
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
