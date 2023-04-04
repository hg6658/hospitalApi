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
exports.deletePatient = exports.validateCredentialsupdatePatient = exports.updatePatient = exports.validateCredentialscreateReport = exports.validateCredentialscreatePatient = exports.allReports = exports.createReport = exports.getPatient = exports.createPatient = void 0;
const patient_1 = require("../models/patient");
const report_1 = require("../models/report");
const user_1 = require("../models/user");
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const joi_password_1 = require("joi-password");
const joiPassword = joi_1.default.extend(joi_password_1.joiPasswordExtendCore);
const nodeCache_1 = __importDefault(require("../config/nodeCache"));
var nodeCache = nodeCache_1.default.nodeCache;
const createPatient = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                throw new Error('User not found');
            }
            yield user_1.User.findById(req.user._id);
            let patient = yield patient_1.Patient.create({
                userName: req.body.userName,
                phoneNo: req.body.phoneNo,
                doctorId: req.user._id
            });
            nodeCache.set(patient._id.toString(), patient, 360000);
            res.status(200).json({
                code: 200,
                patient: patient
            });
        }
        catch (err) {
            res.status(500).json({
                code: 500,
                message: err.message
            });
        }
    });
};
exports.createPatient = createPatient;
var getPatient = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var value = nodeCache.get(req.params.pId);
            if (value) {
                res.status(200).json({
                    code: 200,
                    patient: nodeCache.get(req.params.pId),
                    fetchFromCache: "Yes"
                });
            }
            else {
                let patient = yield patient_1.Patient.findById(new mongoose_1.default.Types.ObjectId(req.params.pId));
                nodeCache.set(req.params.pId, patient, 360000);
                res.status(200).json({
                    code: 200,
                    patient: patient,
                    fetchFromCache: "No"
                });
            }
        }
        catch (err) {
            res.status(500).json({
                code: 500,
                message: err.message
            });
        }
    });
};
exports.getPatient = getPatient;
var validateCredentialscreatePatient = function (req, res, next) {
    try {
        const schema = joi_1.default.object({
            userName: joi_1.default.string().required(),
            phoneNo: joi_1.default.string().length(10).pattern(/^[0-9]+$/).required()
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            console.log(error);
            throw "Invalid Credentials";
        }
        else {
            next();
        }
    }
    catch (err) {
        res.status(403).json({
            code: 403,
            message: "Credentials should follow certain rules",
            userName: "Should be of string",
            phoneNo: "should of string should contains digits only and of 10 digits long"
        });
    }
};
exports.validateCredentialscreatePatient = validateCredentialscreatePatient;
const createReport = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let patient = yield patient_1.Patient.findById(req.params.id);
            let doctor = yield user_1.User.findById(req.user._id);
            if (!(patient && doctor))
                throw new Error('Either or both Ids of patient or doctor is wrong');
            let report = yield report_1.Report.create({
                status: req.body.status,
                date: new Date(),
                doctorId: new mongoose_1.default.Types.ObjectId(req.user._id),
                patientId: new mongoose_1.default.Types.ObjectId(req.params.id)
            });
            nodeCache.set(report._id.toString(), report, 360000);
            nodeCache.del(req.params.id + ":Report");
            res.status(200).json({
                code: 200,
                report: report
            });
        }
        catch (err) {
            res.status(500).json({
                code: 500,
                message: err.message
            });
        }
    });
};
exports.createReport = createReport;
const validateCredentialscreateReport = function (req, res, next) {
    try {
        const schema = joi_1.default.object({
            status: joi_1.default.string().min(5).max(20).required(),
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
        res.status(400).json({
            code: 403,
            message: "Request body should have following keys and configurations",
            status: "should be of type string mnimum 5 character maximum 20 characters"
        });
    }
};
exports.validateCredentialscreateReport = validateCredentialscreateReport;
const allReports = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var value = nodeCache.get(req.params.id + ":Report");
            if (value) {
                res.status(200).json({
                    code: 200,
                    reports: nodeCache.get(req.params.id + ":Report"),
                    fetchedFromCache: "Yes"
                });
                return;
            }
            else {
                let reports = yield report_1.Report.find({ patientId: new mongoose_1.default.Types.ObjectId(req.params.id) }).sort({ date: -1 });
                nodeCache.set(req.params.id + ":Report", reports, 360000);
                res.status(200).json({
                    code: 200,
                    reports: reports,
                    fetchedFromCache: "No"
                });
                return;
            }
        }
        catch (err) {
            res.status(500).json({
                code: 500,
                message: err.message
            });
        }
    });
};
exports.allReports = allReports;
var updatePatient = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let patient = yield patient_1.Patient.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.params.id) }, req.body, { new: true });
            if (!patient)
                throw new Error('No patient found');
            nodeCache.set(req.params.id, patient);
            res.status(200).json({
                code: 200,
                message: 'update Done Successfully'
            });
        }
        catch (err) {
            res.status(500).json({
                code: 500,
                message: err.message
            });
        }
    });
};
exports.updatePatient = updatePatient;
const validateCredentialsupdatePatient = function (req, res, next) {
    try {
        const schema = joi_1.default.object({
            userName: joi_1.default.string(),
            phoneNo: joi_1.default.string().length(10).pattern(/^[0-9]+$/)
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
            code: 403,
            message: "Request body should be following shape",
            userName: "Should be of string",
            phoneNo: "Should be 10 characters long consisting only digits"
        });
    }
};
exports.validateCredentialsupdatePatient = validateCredentialsupdatePatient;
var deletePatient = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield patient_1.Patient.findOneAndRemove({ _id: new mongoose_1.default.Types.ObjectId(req.params.id) });
            yield report_1.Report.deleteMany({ patientId: new mongoose_1.default.Types.ObjectId(req.params.id) });
            nodeCache.del(req.params.id);
            res.status(200).json({
                code: 200,
                message: "Patient Removed Successfully"
            });
        }
        catch (err) {
            res.status(500).json({
                code: 500,
                message: "Internal Server error"
            });
        }
    });
};
exports.deletePatient = deletePatient;
