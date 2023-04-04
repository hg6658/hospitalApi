import {Patient,IPatient} from '../models/patient';
import {Report,IReport} from '../models/report';
import {User,IUser} from '../models/user';
import mongoose from 'mongoose';
import Joi,{Root,StringSchema}  from 'joi';
import { joiPasswordExtendCore } from 'joi-password';
const joiPassword = Joi.extend(joiPasswordExtendCore);
import NC from '../config/nodeCache';
import NodeCache from 'node-cache';
import express from 'express';
var nodeCache:NodeCache = NC.nodeCache;
interface expressUser extends Express.User{
    _id: string; // ... other properties
  }

  
const createPatient:(req:express.Request, res:express.Response)=>void = async function(req:express.Request, res:express.Response){
    try{
    if (!req.user) {
            throw new Error('User not found');
    }
    await User.findById((req.user as expressUser)._id); 
    let patient: IPatient = await Patient.create({
        userName: req.body.userName,
        phoneNo: req.body.phoneNo,
        doctorId: (req.user as expressUser)._id
    })
    nodeCache.set(patient._id.toString(),patient,360000);
    res.status(200).json({
        code: 200,
        patient: patient
    })
    }catch(err: any){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

var getPatient:(req:express.Request, res: express.Response)=>void = async function(req: express.Request, res: express.Response){
    try{
        var value:IPatient|undefined = nodeCache.get(req.params.pId);
        if(value){
            res.status(200).json({
                code: 200,
                patient:nodeCache.get(req.params.pId),
                fetchFromCache:"Yes"
            })
        }else{
            let patient:IPatient|null|undefined = await Patient.findById(new mongoose.Types.ObjectId(req.params.pId));
            nodeCache.set(req.params.pId,patient,360000);
            res.status(200).json({
                code: 200,
                patient:patient,
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

var validateCredentialscreatePatient:(req:express.Request,res:express.Response,next:express.NextFunction)=>void = function(req:express.Request,res:express.Response,next:express.NextFunction){

    try{
        const schema:Joi.ObjectSchema<any>  = Joi.object({
            userName: Joi.string().required(),
            phoneNo: Joi.string().length(10).pattern(/^[0-9]+$/).required()
        });
        const {error,value} =schema.validate(req.body);
        if(error){
            console.log(error);
            throw "Invalid Credentials";
        }else{
            next();
        }
    }catch(err){
        res.status(403).json({
            code: 403,
            message:"Credentials should follow certain rules",
            userName:"Should be of string",
            phoneNo:"should of string should contains digits only and of 10 digits long"
        })
    }
}

const createReport: (req:express.Request,res:express.Response) =>void= async function(req:express.Request, res:express.Response){
    try{
        let patient:IPatient|null|undefined = await Patient.findById(req.params.id);
        let doctor:IUser|null|undefined = await User.findById((req.user as expressUser)._id);
        if(!(patient && doctor)) throw new Error('Either or both Ids of patient or doctor is wrong');
        let report: IReport = await Report.create({
            status: req.body.status,
            date: new Date(),
            doctorId: new mongoose.Types.ObjectId((req.user as expressUser)._id),
            patientId: new mongoose.Types.ObjectId(req.params.id)

        });
        nodeCache.set(report._id.toString(),report,360000);
        nodeCache.del(req.params.id+":Report")
        res.status(200).json({
            code: 200,
            report: report 
        });
    }catch(err: any){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

const validateCredentialscreateReport:(req:express.Request,res:express.Response,next:express.NextFunction)=>void = function(req:express.Request,res:express.Response,next:express.NextFunction){

    try{
        const schema:Joi.ObjectSchema<any>  = Joi.object({
            status: Joi.string().min(5).max(20).required(),
        });
        const {error,value} =schema.validate(req.body);
        if(error){
            throw "Invalid Credentials";
        }else{
            next();
        }
    }catch(err){
        res.status(400).json({
            code: 403,
            message:"Request body should have following keys and configurations",
            status: "should be of type string mnimum 5 character maximum 20 characters"
        })
    }
}

const allReports: (req:express.Request,res:express.Response) =>void= async function(req:express.Request, res:express.Response){
    try{
        var value:IReport[]|undefined = nodeCache.get(req.params.id+":Report");
        if(value){
            res.status(200).json({
                code: 200,
                reports: nodeCache.get(req.params.id+":Report"),
                fetchedFromCache: "Yes" 
            })
            return;
        }else{
            let reports: IReport[]|null|undefined = await Report.find({patientId: new mongoose.Types.ObjectId(req.params.id)}).sort({date: -1});
            nodeCache.set(req.params.id+":Report",reports,360000)
            res.status(200).json({
            code: 200,
            reports: reports,
            fetchedFromCache: "No" 
        })
        return;
        }
        
    }catch(err: any){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}


var updatePatient: (req:express.Request,res:express.Response) =>void= async function(req:express.Request, res:express.Response){
    try{
        let patient: IPatient| null|undefined = await Patient.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params.id)},req.body,{new:true});
        if(!patient) throw new Error('No patient found');
        nodeCache.set(req.params.id,patient);
        res.status(200).json({
            code: 200,
            message: 'update Done Successfully'
        })
    }catch(err: any){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

const validateCredentialsupdatePatient:(req:express.Request,res:express.Response,next:express.NextFunction)=>void = function(req:express.Request,res:express.Response,next:express.NextFunction){

    try{
        const schema:Joi.ObjectSchema<any>  = Joi.object({
            
            userName: Joi.string(),
            phoneNo: Joi.string().length(10).pattern(/^[0-9]+$/)
        });
        const {error,value} =schema.validate(req.body);
        if(error){
            throw "Invalid Credentials";
        }else{
            next();
        }
    }catch(err){
        res.status(403).json({
            code: 403,
            message: "Request body should be following shape",
            userName: "Should be of string",
            phoneNo: "Should be 10 characters long consisting only digits"
        })
    }
}

var deletePatient: (req:express.Request,res:express.Response) =>void= async function(req:express.Request, res:express.Response){
    try{
        await Patient.findOneAndRemove({ _id: new mongoose.Types.ObjectId(req.params.id)});
        await Report.deleteMany({patientId:new mongoose.Types.ObjectId(req.params.id)});
        nodeCache.del(req.params.id);
        res.status(200).json({
            code: 200,
            message: "Patient Removed Successfully"
        })
    }catch(err){
        res.status(500).json({
            code: 500,
            message: "Internal Server error"
        })
    }
}

export{
    createPatient,
    getPatient,
    createReport,
    allReports,
    validateCredentialscreatePatient,
    validateCredentialscreateReport,
    updatePatient,
    validateCredentialsupdatePatient,
    deletePatient
}    
