"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_1 = require("../models/user");
passport_1.default.use('register', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.User.create({
                userName: req.body.userName,
                email: email,
                password: password
            });
            return done(null, user);
        }
        catch (err) {
            done(err);
        }
    });
}));
passport_1.default.use('login', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'user not found' });
            }
            const validate = yield user.isValidPassword(password);
            if (!validate) {
                return done(null, false, { message: 'password incorrct' });
            }
            return done(null, user, { message: 'Login successfully' });
        }
        catch (err) {
            done(err);
        }
    });
}));
module.exports = passport_1.default;
