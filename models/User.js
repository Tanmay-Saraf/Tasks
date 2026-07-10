import mongoose, { mongo } from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        trim:true,
        default:null,
        select:false,
    }
},{
    timestamps:true,
})

const User = mongoose.models.User || mongoose.model("User",userSchema);

export default User;