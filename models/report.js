(function(){
    const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const reportSchema  = new Schema({
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



const Report = mongoose.model('Report',reportSchema);

module.exports = Report;
})();
