

const mongoose = require('mongoose');
const UserApp = require('../models/userAppsModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");

exports.registerUser = async (req, res, next) => {
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
};


exports.loginUser = async (req, res) => {
    const { apiKey, appName } = req.params;
    console.log(apiKey)
    console.log(appName)
    // Find the app based on the apiKey and appName
    const app = await UserApp.findOne({ APIKey: apiKey, name: appName });

    if (!app) {
        return res.status(404).json({ success: false, message: 'App not found.' });
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
            { username: loginValue},
            { phoneNumber: loginValue },
            { useForLogin: loginValue }
        ]
    });
    console.log(user)
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid login credentials.' });
    }


    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid login credentials.' });
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

    res.status(200).json({ success: true, token,user });
};


exports.updateUser = async (req, res) => {
    const { apiKey, appName, userId } = req.params;

    // Find the app based on the apiKey and appName
    const app = await UserApp.findOne({ apiKey, name: appName });

    if (!app) {
        return res.status(404).json({ success: false, message: 'App not found.' });
    }

    // Find the user in the collection
    const user = await User.findOne({ _id: userId, app: app._id });

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
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

    user.name = name;
    if (email) {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address.' });
        }
        user.email = email;
    }

    user.username = username;

    if (!validator.isMobilePhone(phoneNumber, 'any')) {
        return res.status(400).json({ success: false, message: 'Invalid phone number.' });
    }
    user.phoneNumber = phoneNumber;


    user.dob = dob;


    user.gender = gender;


    user.imageUrl = imageUrl;


    user.coverUrl = coverUrl;


    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
    }

    user.useForLogin = useForLogin;

    user.other = other;


    // Save the updated user record
    await user.save();

    res.status(200).json({ success: true, message: 'User updated successfully.' });
};
