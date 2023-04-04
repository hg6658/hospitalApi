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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCredentialsLogin = exports.validateCredentialsRegister = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_password_1 = require("joi-password");
// Create the Joi schema
const joiPassword = joi_1.default.extend(joi_password_1.joiPasswordExtendCore);
const register = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).json({
            message: 'Signup successful',
            user: req.user
        });
    });
};
exports.register = register;
const validateCredentialsRegister = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                userName: joi_1.default.string().min(5).max(200).required(),
                email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
                password: joiPassword.string()
                    .minOfSpecialCharacters(2)
                    .minOfLowercase(2)
                    .minOfUppercase(2)
                    .minOfNumeric(2)
                    .noWhiteSpaces()
                    .required(),
            });
            const { error, value } = schema.validate(req.body);
            if (error) {
                throw "Invalid Credentials";
            }
            else {
                next();
            }
        }
        catch (err) {
            res.status(403).json({
                message: "Credentials should follow certain rules:",
                userName: "should be string minimum 5 characters maximum 200 characters",
                email: "should be string should be of domain .com and .net",
                password: "should string minimum 2 special chars 2 lowercase 2 uppercase 2 numbers"
            });
        }
    });
};
exports.validateCredentialsRegister = validateCredentialsRegister;
const validateCredentialsLogin = function (req, res, next) {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: joiPassword.string()
                .minOfSpecialCharacters(2)
                .minOfLowercase(2)
                .minOfUppercase(2)
                .minOfNumeric(2)
                .noWhiteSpaces()
                .required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw "Invalid Credentials";
        }
        else {
            next();
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(403).json({
            message: "Credentials should follow certain rules:",
            email: "should be string should be of domain .com and .net",
            password: "should string minimum 2 special chars 2 lowercase 2 uppercase 2 numbers"
        });
    }
};
exports.validateCredentialsLogin = validateCredentialsLogin;
