
const ErrorHandler = require("../utils/errorHandler");
const handleAsync = require("../middleware/catchAsyncError");
const userApps = require('../models/userAppsModel')
const successResponse = require("../utils/successResponse");
const { createCollection } = require("../utils/createCollection");
const mongoose = require("mongoose");
const reservedKeywords = ['users']; 

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

exports.insertDataInCollection = handleAsync(async (req, res, next) => {
    const { apiKey, appName, collectionName } = req.body;
    if (collectionName?.trim().toLowerCase() == 'users') {
      return next(new ErrorHandler("You're not authorized to access this protected data", 403));
    }
  
    const data = req.body.data;
  
    try {
      // create a new schema dynamically
      const schema = new mongoose.Schema({}, { strict: false });
  
      // create a new model based on the dynamic schema
      const newCollection = `${apiKey}_${appName}_${collectionName}`;
      const Collection = mongoose.models[newCollection] || mongoose.model(newCollection, schema);
  
      await Collection.insertMany(data);
  
      res.status(200).json({
        success: true,
        message: `Data inserted successfully in ${newCollection.replace(`${apiKey}_${appName}_`, '')} collection`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  });

exports.getDataFromCollection = handleAsync(async (req, res, next) => {
    const { apiKey, appName, collectionName } = req.params;
    if (collectionName?.trim().toLowerCase() == 'users')
      return next(new ErrorHandler("You're not authorized to access this protected data", 403));
  
    const { page, limit } = req.query;
  
    const newCollection = `${apiKey}_${appName}_${collectionName}`;
    console.log(newCollection)
  
    try {
      // Create a Mongoose model for the collection
      const Collection = mongoose.model(newCollection);
  
      // Use the model to execute the `find` method
      const data = await Collection.find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec();
  
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
        console.log(error)
      if (error.name === 'MissingSchemaError') {
        return next(new ErrorHandler("Collection not found", 404));
      }
      next(error);
    }
  });
  
exports.deleteRecordFromCollection = handleAsync(async (req, res, next) => {
    const { apiKey, appName, collectionName, recordId } = req.params;
    if (collectionName?.trim().toLowerCase() == 'users') {
      return next(new ErrorHandler("You're not authorized to access this protected data", 403));
    }
  
    const collection = `${apiKey}_${appName}_${collectionName}`;
  
    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (!collections.some((c) => c.name === collection)) {
      return next(new ErrorHandler("Collection not found", 404));
    }
  
    // Delete record from collection
    const result = await mongoose.connection.db.collection(collection).deleteOne({ _id: new mongoose.Types.ObjectId(recordId) });
  
    // Check if record was deleted
    if (result.deletedCount === 0) {
      return next(new ErrorHandler("Record not found", 404));
    }
  
    res.status(200).send({success:true,message:`Deleted Record Id: ${recordId}`});
  });
  

