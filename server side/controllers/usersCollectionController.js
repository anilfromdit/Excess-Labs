

const mongoose = require('mongoose');
const UserApp = require('../models/userAppsModel');
const bcrypt = require('bcryptjs');
const handleAsync = require("../middleware/catchAsyncError");
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");
const validator = require('validator')

const successResponse = require("../utils/successResponse");
exports.registerUser = handleAsync(
    async (req, res, next) => {
        const { apiKey, appName } = req.params;

        const app = await UserApp.findOne({ APIKey: apiKey, name: appName });

        if (!app) {
            return next(new ErrorHandler("Invalid API key", 400));
        }

        const {
            name,
            email,
            username,
            phoneNumber,
            dob,
            gender,
            imageUrl,
            coverUrl,
            password,
            useForLogin,
            other,
        } = req.body;

        if (!password) {
            return next(new ErrorHandler("Password is required", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCollection = `${apiKey}_${appName}_users`;

        const schema = new mongoose.Schema({}, { strict: false });

        try {
            const Collection = mongoose.models[newCollection] || mongoose.model(newCollection, schema);

            const user = new Collection({
                name,
                email,
                username,
                phoneNumber,
                dob,
                gender,
                imageUrl,
                coverUrl,
                password: hashedPassword,
                useForLogin,
                other,
                app: app._id,
            });
            const savedUser = await user.save();

            const token = jwt.sign(
                {
                    _id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                    username: savedUser.username,
                    phoneNumber: savedUser.phoneNumber,
                    useForLogin: savedUser.useForLogin,
                    app: savedUser.app,
                },
                process.env.USERS_JWT_SECRET,
                { expiresIn: process.env.USERS_JWT_EXPIRE }
            );

            res.status(201).json({
                success: true,
                message: "User registered successfully.",
                user: savedUser,
                token,
            });
        } catch (error) {
            console.log(error)
            if (error.name === "MissingSchemaError") {
                return next(new ErrorHandler("Collection not found", 404));
            }
            next(error);
        }
    })


exports.loginUser = handleAsync(async (req, res, next) => {
    const { apiKey, appName } = req.params;
    console.log(apiKey)
    console.log(appName)
    // Find the app based on the apiKey and appName
    const app = await UserApp.findOne({ APIKey: apiKey, name: appName });

    if (!app) {
        return next(new ErrorHandler("App not found", 404));
    }

    // Extract the login data from the request body
    const { loginValue, password } = req.body;
    const schema = new mongoose.Schema({}, { strict: false });

    const collectionName = `${apiKey}_${appName}_users`
    // Check if the user exists in the collection
    const Collection = mongoose.models[collectionName] || mongoose.model(collectionName, schema);

    const user = await Collection.findOne({
        $or: [
            { email: loginValue },
            { username: loginValue },
            { phoneNumber: loginValue },
            { useForLogin: loginValue }
        ]
    });
    console.log(user)
    if (!user) {
        return next(new ErrorHandler("Invalid Login Credentials", 401));
    }


    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return next(new ErrorHandler("Invalid Login Credentials", 401));
    }

    // Generate a JWT token
    const token = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            username: user.username
        },
        process.env.USERS_JWT_SECRET,
        {
            expiresIn: process.env.USERS_JWT_EXPIRE
        }
    );

    res.status(200).json({ success: true, token, user });
    successResponse(res, 200, token, user)

});

exports.updateUser = handleAsync(async (req, res, next) => {
    const { apiKey, appName } = req.params;
    let userId;
  
    // Find the app based on the apiKey and appName
    const app = await UserApp.findOne({ APIKey: apiKey, name: appName });
  
    if (!app) {
      return next(new ErrorHandler("App not found", 404));
    }
  
    // Extract token from request header and verify it
    let token = req.headers.authorization;
    if (!token) {
      return next(new ErrorHandler("Missing authentication token", 401));
    }
    token = token.replace("Bearer ", "");
  
    try {
      const decodedToken = jwt.verify(token, process.env.USERS_JWT_SECRET);
  
    //   console.log(decodedToken)
      if (!decodedToken._id) {
        return next(new ErrorHandler("Invalid user or token", 400));
      }
      userId = decodedToken._id
  
    } catch (err) {
      return next(new ErrorHandler("Invalid authentication token", 401));
    }
  
    const schema = new mongoose.Schema({}, { strict: false });
  
    // Find the user in the collection
    const collectionName = `${apiKey}_${appName}_users`;
  
    // Check if the user exists in the collection
    const Collection = mongoose.models[collectionName] || mongoose.model(collectionName, schema);
  
    const user = await Collection.findOne({ _id: userId, app: app._id });
  
    if (!user) {
      return next(new ErrorHandler("Invalid user or token", 400));
    }
  
    // Extract the update data from the request body
    const {
      name,
      email,
      username,
      phoneNumber,
      dob,
      gender,
      imageUrl,
      coverUrl,
      password,
      useForLogin,
      other,
    } = req.body;
  
    // Perform validation on each field
    if (name) {
      user.name = name;
    }
  
    if (email) {
      if (!validator.isEmail(email)) {
        return next(new ErrorHandler("Invalid Email Address", 400));
      }
      user.email = email;
    }
  
    if (username) {
      if (!validator.isAlphanumeric(username)) {
        return next(new ErrorHandler("Invalid Username", 400));
      }
      user.username = username;
    }
  
    if (phoneNumber) {
      if (!validator.isMobilePhone(phoneNumber, 'any')) {
        return next(new ErrorHandler("Invalid Phone Number", 400));
      }
      user.phoneNumber = phoneNumber;
    }
  
    if (dob) {
      user.dob = dob;
    }
  
    if (gender) {
      user.gender = gender;
    }
  
    if (imageUrl) {
      user.imageUrl = imageUrl;
    }
  
    if (coverUrl) {
      user.coverUrl = coverUrl;
    }
  
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
  
    if (useForLogin !== undefined) {
      user.useForLogin = useForLogin;
    }
  
    if (other) {
      user.other = other;
    }
  
    // Save the updated user record
    const updatedUser = await user.save();
    console.log(await user.save())
    // console.log(updatedUser)
    res.status(201).json({ message: 'User updated successfully.', updatedUser });
  });
  


exports.getUserProfile = handleAsync(async (req, res, next) => {
    const { apiKey, appName } = req.params;
    let userId;
    // Find the app based on the apiKey and appName
    const app = await UserApp.findOne({ APIKey: apiKey, name: appName });

    if (!app) {
        return next(new ErrorHandler("App not found", 404));
    }

    // Extract token from request header and verify it
    let token = req.headers.authorization;
    if (!token) {
        return next(new ErrorHandler("Missing authentication token", 401));
    }

    token = token.replace("Bearer ", "")

    const schema = new mongoose.Schema({}, { strict: false });
    try {
        const decodedToken = jwt.verify(token, process.env.USERS_JWT_SECRET);
        if (!decodedToken._id) {
            return next(new ErrorHandler("Invalid user or token", 400));
        }
        userId = decodedToken._id
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Invalid authentication token", 401));
    }

    // Find the user in the collection
    const collectionName = `${apiKey}_${appName}_users`;
    // Check if the user exists in the collection
    const Collection = mongoose.models[collectionName] || mongoose.model(collectionName, schema);

    const user = await Collection.findOne({ _id: userId, app: app._id });

    if (!user) {
        return next(new ErrorHandler("Invalid user or token", 400));
    }

    successResponse(res, 200, 'User Profile', user)

});
