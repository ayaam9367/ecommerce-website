const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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
  //console.log(user);
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 404));
  }

  const isPasswordMatched = await user.comparePassword(password);
//console.log(isPasswordMatched);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//Logout User
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

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Get ResetPasswordToken
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  //console.log(resetToken);

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n${resetPasswordUrl}\n\n If you have not requested this email, then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt: Date.now()},
    });

    if(!user){
      return next(new ErrorHandler(`Reset Password Token is invalid or has been expired`, 400));
    }

    if(req.body.password != req.body.confirmPassword){
      return next(new ErrorHandler("Password does match with confirm password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
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

//get user detail -- Only for logged in user
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler(`User not found`, 404));
  }

  const passwordPipeline = createPasswordPipeline(req.params.id);
  const passwordResult = await User.aggregate(passwordPipeline);
  const password = passwordResult[0] ? passwordResult[0].password : null;
  //console.log(password);

  res.status(200).json({
    success: true,
    message: "user found successfully",
    user,
  });
});

//get single user --  ADMIN
exports.getSingleUser = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`User not found`, 404));
  }

  res.status(200).json({
    success : true,
    message : "user details found",
    user
  });
});


//update user profile -- Only for logged in user
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(202).json({
    success: true,
    message: "user updated successfully",
    user,
  });
});

//update user password --only for Logged in user
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler(`User not found`, 404));
  }

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
    return next(new ErrorHandler("old password is incorrect", 400));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  const data = {message : "Password updated successfully"};
  sendToken(user, 200, res, data);

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
