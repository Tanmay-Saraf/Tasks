import connectDb from "@/lib/connectDb";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import User from "@/models/User";

export async function POST(req){
    try {
        await connectDb();
        const body = await req.json();    
        const {name,email,password} = body;
        const trimmedName = name?.trim();
        const trimmedEmail = email?.trim();
        const trimmedPassword = password?.trim();
        if(!trimmedName||!trimmedEmail||!trimmedPassword){
            return NextResponse.json({
                success:false,
                message:"All fields are required",
            },{status:400})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(trimmedEmail)){
            return NextResponse.json({
                success:false,
                message:"Please enter a valid email address"
            },{status:400})
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
        if(!passwordRegex.test(password)){
            return NextResponse.json({
                success:false,
                message:"Password must be atleast 8 characters long and include uppercase , lowercase , a number and a special character"
            },{status:400})
        }
        const hashPass = await bcrypt.hash(password,10);
        const existingUser = await User.findOne({email:trimmedEmail.toLowerCase()});
        if(existingUser){
            return NextResponse.json({
                success:false,
                message:"User already exists"
            },{status:400});
        }
        await User.create({
            name:trimmedName,
            email:trimmedEmail.toLowerCase(),
            password:hashPass,
        });
        return NextResponse.json({
            success:true,
            message:"User saved successfully!"
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message:"Sign Up failed, Internal server error"
        },{status:500})
    }
}