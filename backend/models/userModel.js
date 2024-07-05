const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({

    name:  {
        type : String,
        required : [true, "Please enter your name"],
        maxLength : [30, "Name cannot exceed 30 characters"],
        minLength : [4, "Name should have more than 4 characters"]
    },

    email: {
        type:  String,
        required : [true, "Please enter your email"],
        unique : true,
        validate:  [validator.isEmail, "Please enter a valid email"]
    },

    password: {
        type : String,
        required : [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select : false //you won't be able to findByAttribute on password
    },
    avatar : {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            reqired: true
        },
        
    },

    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date,

    createdAt:  {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("User", userSchema);

/**
 * Future work 
 * Level : Urgent,
 * Description : Add a custom password validator function which ensures that password has 
 * certain characters, similar to the one we used in Attendance Kiosk or any industry standard
 */