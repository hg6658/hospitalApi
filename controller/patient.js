
const Patient = require('../models/patient')
const Report = require('../models/report')
const User = require('../models/user')
const mongoose = require('mongoose');
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const nodeCache = require('../config/nodeCache').nodeCache;

const createPatient = async function(req, res){
    try{
    let doctor = await User.findById(req.user._id); 
    let patient = await Patient.create({
        userName: req.body.userName,
        phoneNo: req.body.phoneNo,
        doctorId: req.user._id
    })
    nodeCache.set(patient._id.toString(),patient,360000);
    res.status(200).json({
        code: 200,
        patient: patient
    })
    }catch(err){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

var getPatient = async function(req,res){
    try{
        var value = nodeCache.get(req.params.pId);
        if(value){
            res.status(200).json({
                code: 200,
                patient:nodeCache.get(req.params.pId),
                fetchFromCache:"Yes"
            })
        }else{
            let patient = await Patient.findById(mongoose.Types.ObjectId(req.params.pId));
            nodeCache.set(req.params.pId,patient,360000);
            res.status(200).json({
                code: 200,
                patient:patient,
                fetchFromCache:"No"
            })
        }

    }catch(err){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

var validateCredentialscreatePatient= function(req,res,next){

    try{
        const schema  = Joi.object({
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

const createReport = async function(req,res){
    try{
        let patient = await Patient.findById(req.params.id);
        let doctor = await User.findById(req.user._id);
        if(!(patient && doctor)) throw new Error('Either or both Ids of patient or doctor is wrong');
        let report = await Report.create({
            status: req.body.status,
            date: new Date(),
            doctorId: mongoose.Types.ObjectId(req.user.id),
            patientId: mongoose.Types.ObjectId(req.params.id)

        });
        nodeCache.set(report._id.toString(),report,360000);
        nodeCache.del(req.params.id+":Report")
        res.status(200).json({
            code: 200,
            report: report 
        });
    }catch(err){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

const validateCredentialscreateReport = function(req,res,next){

    try{
        const schema  = Joi.object({
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

const allReports = async function(req,res){
    try{
        var value = nodeCache.get(req.params.id+":Report");
        if(value){
            res.status(200).json({
                code: 200,
                reports: nodeCache.get(req.params.id+":Report"),
                fetchedFromCache: "Yes" 
            })
            return;
        }else{
            let reports = await Report.find({patientId: mongoose.Types.ObjectId(req.params.id)}).sort({date: -1});
            nodeCache.set(req.params.id+":Report",reports,360000)
            res.status(200).json({
            code: 200,
            reports: reports,
            fetchedFromCache: "No" 
        })
        return;
        }
        
    }catch(err){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}


var updatePatient = async function(req,res){
    try{
        let patient = await Patient.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},req.body,{new:true});
        if(!patient) throw new Error('No patient found');
        nodeCache.set(req.params.id,patient);
        res.status(200).json({
            code: 200,
            message: 'update Done Successfully'
        })
    }catch(err){
        res.status(500).json({
            code: 500,
            message: err.message
        })
    }
}

const validateCredentialsupdatePatient = function(req,res,next){

    try{
        const schema  = Joi.object({
            
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

var deletePatient = async function(req,res){
    try{
        await Patient.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.params.id)});
        await Report.deleteMany({patientId:mongoose.Types.ObjectId(req.params.id)});
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

module.exports = {
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