const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [32, "Name Can't Exceed 32 Characters"],
        minLength: [4, "Name should have at least 4 Characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid email"],
    },
    contactNumber: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "password should have at least 8 Characters"],
        maxLength: [128, "password cannot exceed 128 characters"],
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    lastLoggedIn: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//verifying password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//generating password reset token

userSchema.methods.getResetPasswordToken = function () {
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and storing resetPasswordToken in user data
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; //(15*60*1000 = 15 minutes)

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
