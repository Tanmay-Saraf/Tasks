import { auth } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Board from "@/models/Board";

const getUser = async()=>{
    const session = await auth()
    if(!session)return null
    return session;
}

export async function GET(req){
    const searchParams = req.nextUrl.searchParams;
    const escapeRegex = (str)=>{
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    try {
        const session = await getUser();
        if(!session){
            return NextResponse.json({
                success:false,
                message:"User not logged in!"
            },{status:400})
        }
        await connectDb();
        const page = Number(searchParams.get("page"))||1;
        const limit = Math.min(Number(searchParams.get('limit'))||20,100);
        const skip = (page-1)*limit;
        const query = searchParams.get('query')?.trim()||"";
        const escQuery = escapeRegex(query);
        const filter = {owner:session.user.id}
        if(query){
            filter.title={$regex:escQuery,$options:'i'}
        }
        const sort = searchParams.get('sort');
        let sortObj = {createdAt:-1};
        switch(sort){
            case 'Oldest':
                sortObj={createdAt:1};
                break;
            case 'A-Z':
                sortObj={title:1};
                break;
            case 'Z-A':
                sortObj={title:-1}
                break;
        }
        const boards = await Board.find(filter,{title:1,createdAt:1}).skip(skip).limit(limit).sort(sortObj);
        const total = await Board.countDocuments(filter);
        const totalBoards = await Board.countDocuments({owner:session.user.id});
        const totalPages = Math.ceil(total/limit);
        return NextResponse.json({
            success:true,
            message:"Found",
            boards,
            total,
            totalBoards,
            totalPages,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success:false,
            message:"Server Error",
        },{status:500})
    }
}


export async function POST(req){
    try {
        const session = await getUser();
        if(!session){
            return NextResponse.json({
                success:false,
                message:"User not logged in!"
            },{status:400})
        }
        const user = session.user;
        await connectDb();
        const body = await req.json();
        const {title} = body;
        if(!title.trim()){
            return NextResponse.json({
                success:false,
                message:"Board title cannot be empty or empty spaces"
            },{status:400})
        }
        if(title.trim().length>100){
            return NextResponse.json({
                success:false,
                message:"Title length cannot exceed 100 characters"
            },{status:400})
        }

        const board = await Board.create({
            title:title.trim(),
            owner:user.id,
        });
        return NextResponse.json({
            success:true,
            message:"Board created Successfully!",
            board,
        })
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message:"Server Error", 
        },{status:500})
    }
}

export async function PUT(req){
    try {
        const session = await getUser();
        if(!session){
            return NextResponse.json({
                success:false,
                message:'User not logged in!'
            },{status:400})
        }
        const user = session.user;
        await connectDb();
        const body = await req.json();
        const {title,id} = body;
        if(!title.trim()){
            return NextResponse.json({
                success:false,
                message:"Board title cannot be empty or empty spaces"
            },{status:400})
        }
        if(title.trim().length>100){
            return NextResponse.json({
                success:false,
                message:"Title length cannot exceed 100 characters"
            },{status:400})
        }
        const UpdatedBoard = await Board.findOneAndUpdate({_id:id,owner:user.id},{title:title.trim()});
        if(!UpdatedBoard){
            return NextResponse.json({
                success:false,
                message:`Couldn't find the board!`,
            },{status:400})
        }
        return NextResponse.json({
            success:true,
            message:'Updated Successfully!'
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message:'Server Error'
        },{status:500})
    }
}


export async function DELETE(req){
    try {
        const session = await getUser();
        if(!session){
            return NextResponse.json({
                success:false,
                message:'User not logged in!'
            },{status:400})
        }
        const user = session.user;
        await connectDb();
        const body = await req.json();
        const {id} = body;
        const deleteBoard = await Board.findOneAndDelete({_id:id,owner:user.id});
        if(!deleteBoard){
            return NextResponse.json({
                success:false,
                message:'Board not found'
            },{status:400})
        }
        return NextResponse.json({
            success:true,
            message:'Deleted Successfully'
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success:false,
            message:'Server Error'
        },{status:500})
    }
}