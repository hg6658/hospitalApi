const { GraphQLString , GraphQLID, GraphQLObject } = require('graphql');
const {DoctorType,PatientType,ReporterType} = require('./types');
const Doctor = require('../models/user');
const Patient = require('../models/patient');
const Report = require('../models/report');
const mongoose = require('mongoose');

const registerPatient = {
    type: GraphQLString,
    args:{
        userName: { type: GraphQLString},
        phoneNo: {type: GraphQLString},
    },
    async resolve(parent,args,{user}){
        const patient = await Patient.create({
            userName: args.userName,
            phoneNo: args.phoneNo,
            doctorId: mongoose.Types.ObjectId(user._id)
        });
        return "Patient registered Successfully";
    }
};


const createReport = {
    type: GraphQLString,
    args:{
        status: {type: GraphQLString},
        patientId: {type: GraphQLID}
    },
    async resolve(parent,args,{user}){
        const report = await Report.create({
            status: args.status,
            patientId: mongoose.Types.ObjectId(args.patientId),
            doctorId: mongoose.Types.ObjectId(user._id),
            date: new Date()
        });
        return "report created Succesfully"
    }
}

const updatePatient = {
    type: PatientType,
    args:{
        id: {type: GraphQLString},
        input: {type: GraphQLString}
    },
    async resolve(parent,{id,input}){
        let patient = await Patient.findOneAndUpdate({_id:mongoose.Types.ObjectId(id)},JSON.parse(input),{new:true});
        return patient;
    }
}

let deletePatient = {
    type: GraphQLString,
    args:{
        id: {type: GraphQLID}
    },
    async resolve(parent,args){
        await Patient.findOneAndRemove({ _id: mongoose.Types.ObjectId(args.id)});
        await Report.deleteMany({patientId:mongoose.Types.ObjectId(args.id)});
        return "Patient Deleted Successfully."
    }
}


module.exports = {registerPatient,createReport,updatePatient,deletePatient}