import { auth } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import { NextResponse } from "next/server";
import Board from "@/models/Board";

export async function GET(req){
    const searchParams = req.nextUrl.searchParams;
    const escapeRegex = (str)=>{
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    try {
        const session = await auth()
        if(!session){
            return NextResponse.json({
                success:false,
                message:"User not logged in!"
            },{status:400});
        }
        await connectDb();
        const page = Number(searchParams.get("page"))||1;
        const limit = Math.min(Number(searchParams.get('limit'))||20,100);
        const skip = (page-1)*limit;
        const query = searchParams.get('query')?.trim()||"";
        const escQuery = escapeRegex(query);
        const filter = {owner:session.user.id}
        if(query){
            filter.title={$regex:escQuery,options:'i'}
        }
        const sort = searchParams.get('sort');
        let sortObj = {createdAt:-1};
        switch(sort){
            case 'oldest':
                sortObj={createdAt:1};
                break;
            case 'A-Z':
                sortObj={title:1};
                break;
            case 'Z-A':
                sortObj={title:-1}
                break;
        }
        const boards = await Board.find(filter,"title createdAt").skip(skip).limit(limit).sort(sortObj);
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