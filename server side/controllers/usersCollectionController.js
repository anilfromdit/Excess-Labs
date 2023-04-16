

const mongoose = require('mongoose');
const User = require('../models/User');
const UserApp = require('../models/UserApp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { apiKey, appName } = req.params;

    const app = await UserApp.findOne({ apiKey, name: appName });

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

    const hashedPassword = await bcrypt.hash(password, apiKey);

    const user = new User({
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

    // Save the user object in the `${apiKey}_${appName}_USERS` collection
    const collectionName = `${apiKey}_${appName}_USERS`;
    const UserCollection = mongoose.model(collectionName, User);
    const savedUser = await UserCollection.create(user);

    // Generate a JWT token
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
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ success: true, message: 'User registered successfully.', token });
};

exports.loginUser = async (req, res) => {
    const { apiKey, appName } = req.params;

    // Find the app based on the apiKey and appName
    const app = await UserApp.findOne({ APIKey: apiKey, name: appName });

    if (!app) {
        return res.status(404).json({ success: false, message: 'App not found.' });
    }

    // Extract the login data from the request body
    const { loginValue, password } = req.body;

    // Check if the user exists in the collection
    const user = await db.collection(`${apiKey}_${appName}_USERS`).findOne({
        $or: [
            { email: loginValue, useForLogin: 'email' },
            { username: loginValue, useForLogin: 'username' },
            { phoneNumber: loginValue, useForLogin: 'phoneNumber' },
            { useForLogin: loginValue }
        ]
    });

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
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    res.status(200).json({ success: true, token });
};

exports.updateUser = async (req, res) => {
    const { apiKey, appName, userId } = req.params;

    // Find the app based on the apiKey and appName
    const app = await UserApp.findOne({apiKey, name: appName });

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
