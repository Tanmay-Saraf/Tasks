import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
        default:"",
    },
    column:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Column",
        required:true,
    },
    board:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Board',
        required:true,
    },
    order:{
        type:Number,
        required:true,
    },
    priority:{
        type:String,
        enum:['Low','Medium','High'],
        default:'Low',
    },
})

const Task = mongoose.models.Task || mongoose.model('Task',taskSchema)

export default Task;