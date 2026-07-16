import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import Column from "@/models/Column";
import Board from "@/models/Board";

const getUser = async()=>{
    const session = await auth()
    if(!session)return null
    return session;
}

export async function POST(req){
    try {
        const session = await getUser();
        if(!session)return NextResponse.json({
            success:false,
            message:'User not logged in',
        },{status:400})
        const user = session.user;
        await connectDb();
        const body = await req.json();
        const {title,boardId} = body;
        const trimmedTitle = title.trim();
        if(!trimmedTitle){
            return NextResponse.json({
                success:false,
                message:'Title cannot be empty or empty spaces'
            },{status:400});
        }
        if(trimmedTitle.length>100){
            return NextResponse.json({
                success:false,
                message:'Title cannot exceed 100 characters'
            },{status:400})
        }
        const board = await Board.findOne({
            _id:boardId,
            owner:user.id,
        });
        if(!board){
            return NextResponse.json({
                success:false,
                message:'Board not found'
            },{status:404})
        }
        const order = await Column.countDocuments({board:boardId});
        const column = await Column.create({
            title:trimmedTitle,
            board:boardId,
            order,
        })
        return NextResponse.json({
            success:true,
            message:'Column created successfully!',
            column:{
                _id:column._id,
                title:column.title,
                order:column.order,
            },
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message:'Server Error'
        },{status:500})
    }
}