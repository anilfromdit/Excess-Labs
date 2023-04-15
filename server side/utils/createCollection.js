
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
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

module.exports = { createCollection }