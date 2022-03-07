const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: isEmail } = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter First Name"],
    minlength: [3, " Name should be atleat 3 characters"],
    maxlength: [25, "Name too long"],
  },

  email: {
    type: String,
    required: [true, "Please enter username"],
    validate: [isEmail, "please enter a valid email"],
    unique: [true, "This Email is already registered"],
  },

  mobileNumber: {
    type: Number,
    minlength: [10, "Please enter valid mobile number"],
    maxlength: [11, "Please enter valid mobile number"],
  },
  address: {
    type: String,
  },
  hashedPassword: {
    type: String,
    required: [true, "Please enter a password"],
  },
  profilePic: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//JWT Token ...
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password ...
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.hashedPassword);
};

module.exports = mongoose.model("User", userSchema);
