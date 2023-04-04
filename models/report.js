"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const reportSchema = new Schema({
    status: {
        type: String,
        required: true,
        unique: false
    }, date: {
        type: Date,
        required: true,
        unique: true
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Patient'
    }
});
const Report = mongoose_1.default.model('Report', reportSchema);
exports.Report = Report;
