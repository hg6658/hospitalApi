import {Patient,IPatient} from '../models/patient';
import {User,IUser} from '../models/user';
import {Report,IReport} from '../models/report';
import mongoose from 'mongoose';
import graphql,{GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLList} from 'graphql';
const DoctorType = new GraphQLObjectType({
    name:'Doctor',
    fields:()=>({
        id:{type: GraphQLID},
        userName: {type: GraphQLString},
        email: {type: GraphQLString},
    })
});

const PatientType: any= new GraphQLObjectType({
    name:'Patient',
    fields:()=>({
        id:{type: GraphQLID},
        userName: {type: GraphQLString},
        phoneNo: {type: GraphQLString},
        doctor: {
            type: DoctorType,
            async resolve(parent: any,args: any): Promise<IUser|null>{
                return await User.findById(new mongoose.Types.ObjectId(parent.doctorId));
            } 
        },
        reports:{
            type: new GraphQLList(ReportType),
            async resolve(parent: any,args: any): Promise<IReport[]|null>{
                return await Report.find({patientId:new mongoose.Types.ObjectId(parent.id)});
            }
        }
    })
});


const ReportType: any = new GraphQLObjectType({
    name:'Report',
    fields:()=>({
        id:{type: GraphQLID},
        status: {type: GraphQLString},
        date: {type: GraphQLString},
        doctor: {
            type: DoctorType,
            async resolve(parent: any,args: any): Promise<IUser|null>{
                return await User.findById(new mongoose.Types.ObjectId(parent.doctorId));
            } 
        },
        patient: {
            type: PatientType,
            async resolve(parent: any,args: any):Promise<IPatient|null>{
                return await Patient.findById(new mongoose.Types.ObjectId(parent.patientId));
            }  
        },
    })
});


export {DoctorType,PatientType,ReportType};