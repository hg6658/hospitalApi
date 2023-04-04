import mongoose from "mongoose";
const Schema  = mongoose.Schema;
interface IReport{
    _id: mongoose.Schema.Types.ObjectId,
    status?: String,
    date? : mongoose.Schema.Types.Date,
    doctorId? :mongoose.Schema.Types.ObjectId,
    patientId?: mongoose.Schema.Types.ObjectId
}
const reportSchema  = new Schema<IReport>({
    status:{
        type: String,
        required: true,
        unique: false
    },date:{
        type: Date,
        required: true,
        unique: true
    },
    doctorId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    patientId:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
});



const Report = mongoose.model<IReport>('Report',reportSchema);

export {
    Report,
    IReport
}    

