(function(){
const {Schema,model} = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique: false
    },email:{
        type: String,
        required: true,
        unique: true
    },password:{
        type: String,
        required: true
    }
});
UserSchema.pre('save', async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
    next();
});

UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password,user.password);
    return compare;
}

const User = model('User',UserSchema);

module.exports = User;
})();