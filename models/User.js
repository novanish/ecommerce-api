const mongoose = require("mongoose");
const brycpt = require("bcryptjs");
const { createJWT } = require("../utils/jwt");

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
      required: [true, "Password is required"],
      select: false,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

function hashPassword(password) {
  return brycpt.hash(password, 10);
}

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await hashPassword(this.password);
});

userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await hashPassword(update.password);
  }
});

userSchema.static("doesUserExistsWithEmail", async function (email) {
  return Boolean(await this.findOne({ email }));
});

userSchema.methods.createJWT = function () {
  return createJWT({ userId: this._id, userRole: this.role });
};

userSchema.methods.verifyPassword = function (password) {
  return brycpt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  userObject.id = userObject._id;

  delete userObject.password;
  delete userObject.__v;
  delete userObject._id;

  return userObject;
};

module.exports = mongoose.model("User", userSchema);
