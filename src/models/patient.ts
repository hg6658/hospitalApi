import mongoose from "mongoose";
const  Schema  = mongoose.Schema;
interface IPatient{
    _id: mongoose.Schema.Types.ObjectId,
    userName: String,
    phoneNo: String,
    doctorId: mongoose.Schema.Types.ObjectId
}

const patientSchema  = new Schema<IPatient>({
    userName:{
        type: String,
        required: true,
        unique: false
    },phoneNo:{
        type: String,
        required: true,
        unique: true
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});



const Patient = mongoose.model<IPatient>('Patient',patientSchema);

export {
    Patient,
    IPatient
}
