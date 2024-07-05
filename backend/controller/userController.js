const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");

//Register a User
exports.registerUser = catchAsyncErrors( async(req, res, next) => {

    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id : "this is a sample id",
            url : "profilepicUrl"
        },
    });

    res.status(201).json({
        success: true,
        user,
    });
});

//get user details
//update user details/profile
//update user password
//delete a user -- ADMIN
// get a single user (by id)--ADMIN
//get all users -- ADMIN


//get all users -- ADMIN
exports.getAllUsers = catchAsyncErrors(async(req, res, next) => {

    const users = await User.find();
    res.status(200).json({
        success : true,
        message : "all users found",
        users
    });
});


//get a single user -- ADMIN
exports.getSingleUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404).json({
            success : false,
            message : "user not found"
        });
    } else {
        res.status(200).json({
            success : true,
            message : "user found successfully",
            user
        });
    }
});


//update user profile
exports.updateUser = catchAsyncErrors(async(req, res, next) => {
    let user = await User.findById(req.params.id);
    if(!user){
        res.status(404).json({
            success : false
        });
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true,
    });

    res.status(202).json({
        success : true,
        message : "user updated successfully",
        user,
    });

});


exports.deleteUser = catchAsyncErrors(async(req, res, next) => {
    let user = await User.findById(req.params.id);
    if(!user){
        res.status(404).json({
            success : false,
            message : "user not found"
        });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success : true,
        message : "user deleted successfully"
    });
});
