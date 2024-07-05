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
