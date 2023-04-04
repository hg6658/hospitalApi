"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("./config/mongoose"));
const passport_local_1 = __importDefault(require("./config/passport-local"));
const passport_jwt_1 = __importDefault(require("./config/passport-jwt"));
const http_1 = require("http");
const body_parser_1 = __importDefault(require("body-parser"));
const websocket_1 = __importDefault(require("./config/websocket"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all request
var pp = passport_local_1.default;
var ss = passport_jwt_1.default;
var dbs = mongoose_1.default;
var ps = passport_1.default;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
websocket_1.default.chatSocketInstance(httpServer);
app.use(limiter);
app.use(body_parser_1.default.json()); // support json encoded bodies
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/', require('./routes'));
const server = httpServer.listen(8000, function () {
    console.log(`Server is running on port: 8000`);
});
server.on('error', e => console.error("Error in the running server", e));
module.exports = app;
