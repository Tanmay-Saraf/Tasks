import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    board:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Board",
        required:true,
    },
    order:{
        type:Number,
        default:0,
        required:true,
    }
},{
    timestamps:true,
})

const Column = mongoose.models.Column || mongoose.model("Column",columnSchema)

export default Column