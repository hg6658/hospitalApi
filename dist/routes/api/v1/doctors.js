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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const doctor_1 = require("../../../controller/doctor");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
router.post('/register', doctor_1.validateCredentialsRegister, passport_1.default.authenticate('register', { session: false, failWithError: true }), doctor_1.register);
router.post('/login', doctor_1.validateCredentialsLogin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('login', (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                res.send(500).json({
                    code: 500,
                    message: err.message
                });
                return;
            }
            else if (!user) {
                res.status(500).json({
                    code: 500,
                    message: "User not found"
                });
                return;
            }
            req.login(user, { session: false }, (error) => __awaiter(void 0, void 0, void 0, function* () {
                if (error)
                    return next(error);
                const body = { _id: user._id, email: user.email };
                const token = jsonwebtoken_1.default.sign({ user: body }, process.env.secret_key);
                res.json({ token });
                return;
            }));
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                message: err.message
            });
            return;
        }
    }))(req, res, next);
}));
module.exports = router;
