"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
router.get('/', (req, res) => { res.send("<h1>Hello there please use postman to test this api.</h1>"); });
router.use('/api', require('./api'));
module.exports = router;
