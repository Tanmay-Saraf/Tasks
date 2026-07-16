import BoardPage from "@/components/BoardPage";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Board from "@/models/Board";
import Column from "@/models/Column";
import connectDb from "@/lib/connectDb";
import Task from "@/models/Task";

export default async function Page({ params }) {
    try {
        const session = await auth();
        if (!session) {
            redirect('/login');
        }
        await connectDb();
        const { id } = await params;
        const board = await Board.findOne({
            _id: id,
            owner: session.user.id,
        }, {
            title: 1,
            createdAt: 1,
        }).lean()
        if (!board) {
            notFound();
        }
        const columns = await Column.find({board:board._id},{title:1,order:1}).sort({order:1}).lean()
        const tasks = await Task.find({board:board._id},{title:1,description:1,order:1,priority:1,column:1}).sort({order:1}).lean();
        const groupedTasks = {};
        for(const task of tasks){
            const idx = task.column.toString();
            if(!groupedTasks[idx]){
                groupedTasks[idx] = []
            }
            groupedTasks[idx].push(task);
        }
        const columnsWithTask  = columns.map(column=>({
                ...column,
                tasks:groupedTasks[column._id.toString()]||[],
            }
            )
        )
            return <BoardPage board={JSON.parse(JSON.stringify(board))} columns={JSON.parse(JSON.stringify(columnsWithTask))}/>
    } catch (error) {
        console.error(error);
        if(error.name==='CastError'){
            notFound();
        }
        throw error;
    }
}