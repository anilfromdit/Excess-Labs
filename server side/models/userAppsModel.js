
const mongoose = require("mongoose");

const userApps = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "App Name Can't Be Blank"],
        maxLength: [32, "Name Can't Exceed 32 Characters"],
        minLength: [4, "Name should have at least 4 Characters"],
    },
    description: String,
    longDescription: String,
    APIKey: {
        type: String,
        required: [true, "API KEY Can't Be Blank"],
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
userApps.statics.apiKeyExists = async function (apiKey) {
    const app = await this.findOne({ APIKey: apiKey });
    return !!app;
};

module.exports = mongoose.model("UserApps", userApps);
