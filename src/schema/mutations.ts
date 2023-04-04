import { GraphQLString , GraphQLID} from 'graphql';
import {DoctorType,PatientType} from './types';
import {Patient,IPatient} from '../models/patient';
import {User,IUser} from '../models/user';
import {Report,IReport} from '../models/report';
import mongoose from 'mongoose';

const registerPatient = {
    type: GraphQLString,
    args:{
        userName: { type: GraphQLString},
        phoneNo: {type: GraphQLString},
    },
    async resolve(parent: any,args: any,{user}: any): Promise<string>{
        const patient = await Patient.create({
            userName: args.userName,
            phoneNo: args.phoneNo,
            doctorId:new  mongoose.Types.ObjectId(user._id)
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
    async resolve(parent: any,args: any,{user}: any):Promise<string>{
        const report = await Report.create({
            status: args.status,
            patientId: new mongoose.Types.ObjectId(args.patientId),
            doctorId: new mongoose.Types.ObjectId(user._id),
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
    async resolve(parent: any,{id,input}: any): Promise<IPatient|null> {
        let patient = await Patient.findOneAndUpdate({_id:new mongoose.Types.ObjectId(id)},JSON.parse(input),{new:true});
        return patient;
    }
}

let deletePatient = {
    type: GraphQLString,
    args:{
        id: {type: GraphQLID}
    },
    async resolve(parent: any,args: any): Promise<string>{
        await Patient.findOneAndRemove({ _id: new mongoose.Types.ObjectId(args.id)});
        await Report.deleteMany({patientId:new mongoose.Types.ObjectId(args.id)});
        return "Patient Deleted Successfully."
    }
}


export {registerPatient,createReport,updatePatient,deletePatient}