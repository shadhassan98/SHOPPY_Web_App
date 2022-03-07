const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");

// Register a new user ...
exports.registerNewUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const emailExist = await userModel.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(400).send("Email already exists");
    return;
  }

  if (password.length < 8) {
    res.status(400).send("Password should be at least 8 characters");
    return;
  }

  //Hashing the password ..
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = await userModel.create({
    name,
    email,
    hashedPassword,
    profilePic: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

//Login User ..
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if boyh email and password is entered...
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid User"));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("You have entered Invalid Password", 401));
  }
  sendToken(user, 200, res);
});

//Logout User ..
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get user details ..
exports.getuserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Get all Users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//Delete a User -- Admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.remove();
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
