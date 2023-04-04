import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
interface IUser{
    _id: mongoose.Schema.Types.ObjectId,
    userName?: String,
    email?: String,
    password?: String,
    isValidPassword:(password: string)=>boolean
}
const UserSchema = new Schema<IUser>({
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

UserSchema.methods.isValidPassword = async function(password:string){
    const user = this;
    const compare = await bcrypt.compare(password,user.password);
    return compare;
}

const User = mongoose.model<IUser>('User',UserSchema);

export {
    User,
    IUser
};