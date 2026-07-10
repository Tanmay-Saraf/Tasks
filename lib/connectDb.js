import mongoose from "mongoose";

const connectDb = async ()=>{
    if(mongoose.connection.readyState===1){
        return ;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected");
    } catch (error) {
        console.error(error);
        throw new Error('Db connection error');
    }
}

export default connectDb;