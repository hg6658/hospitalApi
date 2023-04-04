"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose_1.default.set("strictQuery", false);
mongoose_1.default.connect(process.env.mongo_uri);
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
db.once('open', function () {
    console.log('Connected to Database :: MongoDB');
});
module.exports = db;
