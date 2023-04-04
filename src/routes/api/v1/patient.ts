import express from 'express';
const router = express.Router();
import passport from 'passport';
import {
    createPatient,
    getPatient,
    createReport,
    allReports,
    validateCredentialscreatePatient,
    validateCredentialscreateReport,
    updatePatient,
    validateCredentialsupdatePatient,
    deletePatient} from '../../../controller/patient';

router.post('/register', validateCredentialscreatePatient, createPatient);

router.post('/create_report/:id', validateCredentialscreateReport, createReport);
router.post('/updatePatient/:id', validateCredentialsupdatePatient, updatePatient);

router.get('/all_reports/:id', allReports);

router.delete('/deletePatient/:id', deletePatient);
router.get('/getPatient/:pId', getPatient);


export = router;