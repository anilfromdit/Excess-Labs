
const ErrorHandler = require("../utils/errorHandler");
const handleAsync = require("../middleware/catchAsyncError");
const userApps = require('../models/userAppsModel')
const successResponse = require("../utils/successResponse");
const { createCollection } = require("../utils/createCollection");
const mongoose = require("mongoose");

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

    await createCollection(apiKey, userApp.name, collectionName, schema, next);
    return successResponse(res, 201, `New Collection Created`)
})

exports.getAllCollectionOfAnApp = handleAsync(async (req, res, next) => {
    const { apiKey, appName } = req.params
    const apiKeyExists = await userApps.apiKeyExists(apiKey);
    if (!apiKeyExists) {
        return next(new ErrorHandler('Invalid API Key', 401));
    }
    const collections = await mongoose.connection.db.listCollections().toArray();
    const appCollections = collections.filter((c) => c.name.toLowerCase().startsWith(`${apiKey.toLowerCase()}_${appName.toLowerCase()}_`));
    const collectionNames = appCollections.map((c) => c.name.replace(`${apiKey}_${appName}_`, ''));

    successResponse(res, 200, `${collectionNames.length} Collection(s) found for ${appName}`, collectionNames)
});
