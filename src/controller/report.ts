import {Patient,IPatient} from '../models/patient';
import {Report,IReport} from '../models/report';
import mongoose from 'mongoose';
import nodeCache from '../config/nodeCache';
import express from 'express';


const allReports: (req:express.Request,res:express.Response) =>void= async function(req:express.Request, res:express.Response){
    try{
        let reports:IReport[]|undefined|null = await Report.find({status: req.params.status});
        res.status(200).json({
            code: 200,
            reports: reports
        })
    }catch(err: any){
        res.status(500).json({code: 500, message: err.message});
    }
}
var getReport: (req:express.Request,res:express.Response) =>void= async function(req:express.Request, res:express.Response){
    try{
        var value:IReport|undefined = nodeCache.nodeCache.get(req.params.rId);
        if(value){
            res.status(200).json({
                code: 200,
                report:nodeCache.nodeCache.get(req.params.rId),
                fetchFromCache:"Yes"
            })
        }else{
            let report:IReport|null|undefined = await Report.findById(new mongoose.Types.ObjectId(req.params.rId));
            nodeCache.nodeCache.set(req.params.rId,report,360000);
            res.status(200).json({
                code: 200,
                report:report,
                fetchFromCache:"No"
            })
        }

    }catch(err: any){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

export {
    allReports,
    getReport
}
