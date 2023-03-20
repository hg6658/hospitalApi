const router = require('express').Router();
const passport = require('passport');
const patientController = require('../../../controller/patient');

router.post('/register',patientController.validateCredentialscreatePatient,patientController.createPatient);

router.post('/create_report/:id',patientController.validateCredentialscreateReport,patientController.createReport);
router.post('/updatePatient/:id',patientController.validateCredentialsupdatePatient,patientController.updatePatient);

router.get('/all_reports/:id',patientController.allReports);

router.delete('/deletePatient/:id',patientController.deletePatient);
router.get('/getPatient/:pId',patientController.getPatient);



module.exports = router;