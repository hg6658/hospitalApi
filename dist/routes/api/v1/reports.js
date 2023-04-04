"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const report_1 = require("../../../controller/report");
router.get('/:status', report_1.allReports);
router.get('/getReport/:rId', report_1.getReport);
module.exports = router;
