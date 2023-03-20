const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const patientSchema  = new Schema({
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
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});



const Patient = mongoose.model('Patient',patientSchema);

module.exports = Patient;