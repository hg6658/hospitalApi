const graphql = require('graphql');
const {GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLList} = graphql;
const Patient = require('../models/patient');
const Doctor = require('../models/user');
const Report = require('../models/report');
const {DoctorType, PatientType,ReportType} = require('./types');
const mongoose = require('mongoose');
const {registerPatient,createReport,updatePatient,deletePatient} = require('./mutations');
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        patient:{
            type: PatientType,
            args:{
                id:{type: GraphQLID}
            },
            async resolve(parent,args){
                return await Patient.findById(mongoose.Types.ObjectId(args.id));
            }
        },
        report:{
            type: ReportType,
            args:{
                id:{type: GraphQLID},
            },
            async resolve(parent,args){
                return await Report.findById(mongoose.Types.ObjectId(args.id));
            }
        },
        reports:{
            type: new GraphQLList(ReportType),
            args:{
                status:{type: GraphQLString}
            },
            async resolve(parent,args){
                return await Report.find({status:args.status});
            }
        },
        patients:{
            type: new GraphQLList(PatientType),
            args:{

            },
            async resolve(parent,args,{user}){
                return await Patient.find({doctorId:mongoose.Types.ObjectId(user._id)});
            }
        }
    } 
});

const rootMutation = new GraphQLObjectType({
    name: 'rootMutation',
    fields:{registerPatient,createReport,updatePatient,deletePatient}
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: rootMutation
})