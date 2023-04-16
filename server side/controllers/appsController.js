const handleAsync = require("../middleware/catchAsyncError");
const userApps = require('../models/userAppsModel')
const successResponse = require("../utils/successResponse");
const { createCollection } = require("../utils/createCollection");
const { generateApiKey } = require("../utils/generateApiKey");

exports.myApps = handleAsync(async (req, res, next) => {
    const apps = await userApps.find({ owner: req.user._id }).lean();
    return successResponse(res, 200, `Found ${apps.length} App(s)`, apps);
});

exports.createApp = handleAsync(async (req, res, next) => {
    const { name, description, longDescription } = req.body;
    if (!name || name.trim() == "") {
        throw new Error("name is required");
    }
    const app = await userApps.findOne({ owner: req.user._id, name }).lean();
    if (app) {
        throw new Error(`Project with name ${ name } already exists.Please choose a different name for your new project.`);
    }
    const apiKey = generateApiKey(req.user._id);
    await createCollection(apiKey, name, 'USERS', null);
    const userApp = await userApps.create({
        name,
        description,
        longDescription,
        APIKey: apiKey,
        owner: req.user._id
    });
    return successResponse(res, 201, `Created New App`, userApp);
});