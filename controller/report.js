(function (){
    const Patient = require('../models/patient')
const Report = require('../models/report')
const mongoose = require('mongoose');
const nodeCache = require('../config/nodeCache');


const allReports = async function(req ,res ){
    try{
        let reports = await Report.find({status: req.params.status});
        res.status(200).json({
            code: 200,
            reports: reports
        })
    }catch(err ){
        res.status(500).json({code: 500, message: err.message});
    }
}
var getReport = async function(req ,res ){
    try{
        var value = nodeCache.nodeCache.get(req.params.rId);
        if(value){
            res.status(200).json({
                code: 200,
                report:nodeCache.nodeCache.get(req.params.rId),
                fetchFromCache:"Yes"
            })
        }else{
            let report = await Report.findById(mongoose.Types.ObjectId(req.params.rId));
            nodeCache.nodeCache.set(req.params.rId,report,360000);
            res.status(200).json({
                code: 200,
                report:report,
                fetchFromCache:"No"
            })
        }

    }catch(err ){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

module.exports = {
    allReports: allReports,
    getReport
}
})();
