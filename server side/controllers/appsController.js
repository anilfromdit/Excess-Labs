
const ErrorHandler = require("../utils/errorHandler");
const handleAsync = require("../middleware/catchAsyncError");
const userApps = require('../models/userAppsModel')
const mongoose = require("mongoose");
const successResponse = require("../utils/successResponse");
const { createCollection } = require("../utils/createCollection");
const { generateApiKey } = require("../utils/generateApiKey");

exports.myApps = handleAsync(async (req, res, next) => {
    console.log(req.user._id)
    const apps = await userApps.find({ owner: req.user._id });

    return successResponse(res, 200, `Found ${apps.length} App(s)`, apps)
})

exports.createApp = handleAsync(async (req, res, next) => {
    const { name, description, longDescription } = req.body;
    if (!name || name.trim() == "")
        return next(new ErrorHandler("name is required", 400));
    const apps = await userApps.find({ owner: req.user._id, name: name });
    console.log(apps)
    if (apps.length > 0)
        return next(new ErrorHandler(`Project with name ${name} already exists. Please choose a different name for your new project.`, 404));
    // Usage: Generate a random API key of length 16
    const apiKey = generateApiKey(req.user._id);

    await createCollection(apiKey, name, 'default', null);

    const userApp = await userApps.create({
        name: name,
        description: description,
        longDescription: longDescription,
        APIKey: apiKey,
        owner: req.user._id
    });
    return successResponse(res, 201, `Created New App`, userApp)
})



