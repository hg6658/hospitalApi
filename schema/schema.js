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
const graphql_1 = require("graphql");
const patient_1 = require("../models/patient");
const report_1 = require("../models/report");
const types_1 = require("./types");
const mongoose_1 = __importDefault(require("mongoose"));
const mutations_1 = require("./mutations");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        patient: {
            type: types_1.PatientType,
            args: {
                id: { type: graphql_1.GraphQLID }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield patient_1.Patient.findById(new mongoose_1.default.Types.ObjectId(args.id));
                });
            }
        },
        report: {
            type: types_1.ReportType,
            args: {
                id: { type: graphql_1.GraphQLID },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield report_1.Report.findById(new mongoose_1.default.Types.ObjectId(args.id));
                });
            }
        },
        reports: {
            type: new graphql_1.GraphQLList(types_1.ReportType),
            args: {
                status: { type: graphql_1.GraphQLString }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield report_1.Report.find({ status: args.status });
                });
            }
        },
        patients: {
            type: new graphql_1.GraphQLList(types_1.PatientType),
            args: {},
            resolve(parent, args, { user }) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield patient_1.Patient.find({ doctorId: new mongoose_1.default.Types.ObjectId(user._id) });
                });
            }
        }
    }
});
const rootMutation = new graphql_1.GraphQLObjectType({
    name: 'rootMutation',
    fields: { registerPatient: mutations_1.registerPatient, createReport: mutations_1.createReport, updatePatient: mutations_1.updatePatient, deletePatient: mutations_1.deletePatient }
});
module.exports = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: rootMutation
});
