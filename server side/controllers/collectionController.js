
const ErrorHandler = require("../utils/errorHandler");
const handleAsync = require("../middleware/catchAsyncError");
const userApps = require('../models/userAppsModel')
const successResponse = require("../utils/successResponse");
const { createCollection } = require("../utils/createCollection");

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
