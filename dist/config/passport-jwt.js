"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const user_1 = require("../models/user");
var opts = {};
opts.jwtFromRequest = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secret_key;
passport_1.default.use(new passport_jwt_1.Strategy(opts, function (jwt_payload, done) {
    user_1.User.findOne({ email: jwt_payload.user.email }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
module.exports = passport_1.default;
