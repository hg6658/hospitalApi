const Patient = require('../models/patient');
const Doctor = require('../models/user');
const Report = require('../models/report');
const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLList} = graphql;
const DoctorType = new GraphQLObjectType({
    name:'Doctor',
    fields:()=>({
        id:{type: GraphQLID},
        userName: {type: GraphQLString},
        email: {type: GraphQLString},
    })
});

const PatientType = new GraphQLObjectType({
    name:'Patient',
    fields:()=>({
        id:{type: GraphQLID},
        userName: {type: GraphQLString},
        phoneNo: {type: GraphQLString},
        doctor: {
            type: DoctorType,
            async resolve(parent,args){
                return await Doctor.findById(mongoose.Types.ObjectId(parent.doctorId));
            } 
        },
        reports:{
            type: new GraphQLList(ReportType),
            async resolve(parent,args){
                return await Report.find({patientId:mongoose.Types.ObjectId(parent.id)});
            }
        }
    })
});


const ReportType = new GraphQLObjectType({
    name:'Report',
    fields:()=>({
        id:{type: GraphQLID},
        status: {type: GraphQLString},
        date: {type: GraphQLString},
        doctor: {
            type: DoctorType,
            async resolve(parent,args){
                return await Doctor.findById(mongoose.Types.ObjectId(parent.doctorId));
            } 
        },
        patient: {
            type: PatientType,
            async resolve(parent,args){
                return await Patient.findById(mongoose.Types.ObjectId(parent.patientId));
            }  
        },
    })
});


module.exports = {DoctorType,PatientType,ReportType};