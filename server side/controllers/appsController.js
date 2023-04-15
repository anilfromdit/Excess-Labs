
const ErrorHandler = require("../utils/errorHandler");
const handleAsync = require("../middleware/catchAsyncError");
const userApps = require('../models/userAppsModel')
const mongoose = require("mongoose");
const crypto = require('crypto');
const successResponse = require("../utils/successResponse");

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

exports.addCollection = handleAsync(async (req, res, next) => {
    const { apiKey, collectionName, schema } = req.body;
    if (!(apiKey && collectionName))
        return next(new ErrorHandler(`Api Key and Collection Name required`, 400));

    const userApp = await userApps.findOne({ APIKey: apiKey }).populate({
        path: 'owner',
        select: 'name'
    });
    if (!userApp || userApp.owner.id !== req.user.id)
        return next(new ErrorHandler("Unauthorized or Invalid API Key", 401));

    await createCollection(apiKey, userApp.name, collectionName, schema,next);
    return successResponse(res, 201, `New Collection Created`)
})

function generateApiKey(email) {
    const timestamp = Date.now().toString();
    const data = email + timestamp;
    const apiKey = crypto.createHash('sha256').update(data).digest('hex');
    return apiKey;
}

async function createCollection(apiKey, appName, collectionName, schema) {
    const newCollection = `${apiKey}_${appName}_${collectionName}`;

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections)
    if (collections.some((c) => c.name.toLowerCase() === newCollection.toLowerCase())) {
        throw new ErrorHandler("Collection already exists", 400)
      }

    const Collection = schema ? mongoose.model(newCollection, new mongoose.Schema(schema)) : mongoose.model(newCollection, new mongoose.Schema({}));
    await Collection.create({});
}
