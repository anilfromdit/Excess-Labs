const User = require("../models/usersModel");
const ErrorHandler = require("../utils/errorHandler");
const handleAsync = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = handleAsync(async (req, res, next) => {

    const { name, email, password, contactNumber } = req.body;
console.log(req.body)
    const user = await User.create({
        name,
        email,
        password,
        contactNumber,

    });
    let message = `${name},Thank you for signing up at Excess Labs.\nLooking forward to serve you`
    try {
        await sendEmail({
            email,
            subject: `Welcome To Excess Labs`,
            message,
        });
    }
    catch (e) {
        console.log(e.message)
    }
    sendToken(user, 201, res);
});

exports.loginUser = handleAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Email and Password Required"));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    //   var clientIp = requestIp.getClientIp(req);
    //   let message = `${user.name}, A new login to your account from IP: ${clientIp} is detected\nIf not done by you we recommend you to change your password immediately`
    //  try{
    //   await sendEmail({
    //     email,
    //     subject: `New Login Detected`,
    //     message,
    //   });
    // }
    // catch(e){
    //   console.log(e.message)
    // }
    sendToken(user, 200, res);
});

exports.logoutUser = handleAsync(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  });