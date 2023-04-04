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
exports.getReport = exports.allReports = void 0;
const report_1 = require("../models/report");
const mongoose_1 = __importDefault(require("mongoose"));
const nodeCache_1 = __importDefault(require("../config/nodeCache"));
const allReports = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let reports = yield report_1.Report.find({ status: req.params.status });
            res.status(200).json({
                code: 200,
                reports: reports
            });
        }
        catch (err) {
            res.status(500).json({ code: 500, message: err.message });
        }
    });
};
exports.allReports = allReports;
var getReport = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var value = nodeCache_1.default.nodeCache.get(req.params.rId);
            if (value) {
                res.status(200).json({
                    code: 200,
                    report: nodeCache_1.default.nodeCache.get(req.params.rId),
                    fetchFromCache: "Yes"
                });
            }
            else {
                let report = yield report_1.Report.findById(new mongoose_1.default.Types.ObjectId(req.params.rId));
                nodeCache_1.default.nodeCache.set(req.params.rId, report, 360000);
                res.status(200).json({
                    code: 200,
                    report: report,
                    fetchFromCache: "No"
                });
            }
        }
        catch (err) {
            res.status(500).json({
                code: 500,
                message: err.message
            });
        }
    });
};
exports.getReport = getReport;
