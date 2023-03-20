const router = require('express').Router();
const passport = require('passport');
const reportController = require('../../../controller/report');


router.get('/:status',reportController.allReports)
router.get('/getReport/:rId',reportController.getReport);
module.exports = router;