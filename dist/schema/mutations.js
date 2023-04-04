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
exports.deletePatient = exports.updatePatient = exports.createReport = exports.registerPatient = void 0;
const graphql_1 = require("graphql");
const types_1 = require("./types");
const patient_1 = require("../models/patient");
const report_1 = require("../models/report");
const mongoose_1 = __importDefault(require("mongoose"));
const registerPatient = {
    type: graphql_1.GraphQLString,
    args: {
        userName: { type: graphql_1.GraphQLString },
        phoneNo: { type: graphql_1.GraphQLString },
    },
    resolve(parent, args, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            const patient = yield patient_1.Patient.create({
                userName: args.userName,
                phoneNo: args.phoneNo,
                doctorId: new mongoose_1.default.Types.ObjectId(user._id)
            });
            return "Patient registered Successfully";
        });
    }
};
exports.registerPatient = registerPatient;
const createReport = {
    type: graphql_1.GraphQLString,
    args: {
        status: { type: graphql_1.GraphQLString },
        patientId: { type: graphql_1.GraphQLID }
    },
    resolve(parent, args, { user }) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield report_1.Report.create({
                status: args.status,
                patientId: new mongoose_1.default.Types.ObjectId(args.patientId),
                doctorId: new mongoose_1.default.Types.ObjectId(user._id),
                date: new Date()
            });
            return "report created Succesfully";
        });
    }
};
exports.createReport = createReport;
const updatePatient = {
    type: types_1.PatientType,
    args: {
        id: { type: graphql_1.GraphQLString },
        input: { type: graphql_1.GraphQLString }
    },
    resolve(parent, { id, input }) {
        return __awaiter(this, void 0, void 0, function* () {
            let patient = yield patient_1.Patient.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(id) }, JSON.parse(input), { new: true });
            return patient;
        });
    }
};
exports.updatePatient = updatePatient;
let deletePatient = {
    type: graphql_1.GraphQLString,
    args: {
        id: { type: graphql_1.GraphQLID }
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield patient_1.Patient.findOneAndRemove({ _id: new mongoose_1.default.Types.ObjectId(args.id) });
            yield report_1.Report.deleteMany({ patientId: new mongoose_1.default.Types.ObjectId(args.id) });
            return "Patient Deleted Successfully.";
        });
    }
};
exports.deletePatient = deletePatient;
