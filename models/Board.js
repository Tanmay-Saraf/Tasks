import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},{
    timestamps:true,
})

const Board = mongoose.models.Board || mongoose.model("Boars",boardSchema);

export default Board;