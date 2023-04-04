"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const patientSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: false
    }, phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Patient = mongoose_1.default.model('Patient', patientSchema);
exports.Patient = Patient;
