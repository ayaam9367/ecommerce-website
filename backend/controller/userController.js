const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const sendToken = require("../utils/jwtToken");

const ObjectId = mongoose.Types.ObjectId;

//Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepicUrl",
    },
  });

  sendToken(user, 201, res);
});

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking is user has given both email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please enter both email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 404));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//update user password

//get all users -- ADMIN
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    message: "all users found",
    users,
  });
});

//get a single user -- ADMIN
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found`, 404));
  }

  const passwordPipeline = createPasswordPipeline(req.params.id);
  const passwordResult = await User.aggregate(passwordPipeline);
  const password = passwordResult[0] ? passwordResult[0].password : null;
  console.log(password);

  res.status(200).json({
    success: true,
    message: "user found successfully",
    user,
  });
});

//update user profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found`, 404));
  }

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(202).json({
    success: true,
    message: "user updated successfully",
    user,
  });
});

//update user password
exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found`, 404));
  }
});

//update user role -- ADMIN
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found`, 404));
  }

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "user updated successfully",
    user,
  });
});

//delete user -- ADMIN
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found`, 404));
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});

const createPasswordPipeline = (id) => [
  {
    $match: {
      _id: new ObjectId(id),
    },
  },

  {
    $project: {
      password: 1,
      _id: 0,
    },
  },
];

/**
 * Future Work
 *
 * Level : Urgent
 * Descriiption : make a private function to check whether the user witht the given id exists (DRY)
 */
