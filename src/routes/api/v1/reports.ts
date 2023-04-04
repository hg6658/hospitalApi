import express from 'express';
const router = express.Router();
import passport from 'passport';
import {
    allReports,
    getReport
}
from '../../../controller/report';


router.get('/:status',allReports)
router.get('/getReport/:rId',getReport);
export = router;