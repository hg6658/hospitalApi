import graphql,{GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLList} from 'graphql';
import {Patient,IPatient} from '../models/patient';
import {User,IUser} from '../models/user';
import {Report,IReport} from '../models/report';
import {DoctorType, PatientType,ReportType} from './types';
import mongoose from 'mongoose'
import {registerPatient,createReport,updatePatient,deletePatient} from './mutations';
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        patient:{
            type: PatientType,
            args:{
                id:{type: GraphQLID}
            },
            async resolve(parent: any,args: any):Promise<IPatient|null>{
                return await Patient.findById(new mongoose.Types.ObjectId(args.id));
            }
        },
        report:{
            type: ReportType,
            args:{
                id:{type: GraphQLID},
            },
            async resolve(parent: any,args: any): Promise<IReport|null>{
                return await Report.findById(new mongoose.Types.ObjectId(args.id));
            }
        },
        reports:{
            type: new GraphQLList(ReportType),
            args:{
                status:{type: GraphQLString}
            },
            async resolve(parent: any,args: any):Promise<IReport[]|null>{
                return await Report.find({status:args.status});
            }
        },
        patients:{
            type: new GraphQLList(PatientType),
            args:{

            },
            async resolve(parent: any,args: any,{user}):Promise<IPatient[]|null>{
                return await Patient.find({doctorId:new mongoose.Types.ObjectId(user._id)});
            }
        }
    } 
});

const rootMutation = new GraphQLObjectType({
    name: 'rootMutation',
    fields:{registerPatient,createReport,updatePatient,deletePatient}
})

export = new GraphQLSchema({
    query: RootQuery,
    mutation: rootMutation
})