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
exports.ReportType = exports.PatientType = exports.DoctorType = void 0;
const patient_1 = require("../models/patient");
const user_1 = require("../models/user");
const report_1 = require("../models/report");
const mongoose_1 = __importDefault(require("mongoose"));
const graphql_1 = require("graphql");
const DoctorType = new graphql_1.GraphQLObjectType({
    name: 'Doctor',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        userName: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
    })
});
exports.DoctorType = DoctorType;
const PatientType = new graphql_1.GraphQLObjectType({
    name: 'Patient',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        userName: { type: graphql_1.GraphQLString },
        phoneNo: { type: graphql_1.GraphQLString },
        doctor: {
            type: DoctorType,
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield user_1.User.findById(new mongoose_1.default.Types.ObjectId(parent.doctorId));
                });
            }
        },
        reports: {
            type: new graphql_1.GraphQLList(ReportType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield report_1.Report.find({ patientId: new mongoose_1.default.Types.ObjectId(parent.id) });
                });
            }
        }
    })
});
exports.PatientType = PatientType;
const ReportType = new graphql_1.GraphQLObjectType({
    name: 'Report',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        status: { type: graphql_1.GraphQLString },
        date: { type: graphql_1.GraphQLString },
        doctor: {
            type: DoctorType,
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield user_1.User.findById(new mongoose_1.default.Types.ObjectId(parent.doctorId));
                });
            }
        },
        patient: {
            type: PatientType,
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield patient_1.Patient.findById(new mongoose_1.default.Types.ObjectId(parent.patientId));
                });
            }
        },
    })
});
exports.ReportType = ReportType;
