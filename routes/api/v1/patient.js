"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const patient_1 = require("../../../controller/patient");
router.post('/register', patient_1.validateCredentialscreatePatient, patient_1.createPatient);
router.post('/create_report/:id', patient_1.validateCredentialscreateReport, patient_1.createReport);
router.post('/updatePatient/:id', patient_1.validateCredentialsupdatePatient, patient_1.updatePatient);
router.get('/all_reports/:id', patient_1.allReports);
router.delete('/deletePatient/:id', patient_1.deletePatient);
router.get('/getPatient/:pId', patient_1.getPatient);
module.exports = router;
