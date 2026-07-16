import React, { useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import OptionsMenu from './OptionsMenu';

const ColumnCard = ({ id, title, tasks }) => {
    const [openOptions, setOpenOptions] = useState(false);
    const [openEdit, setOpenEdit] = useState(false)
    const handleDelete = async ()=>{

    }
    return (
        <div className="column bg-zinc-100 border border-neutral-200 p-4 rounded-xl h-[75vh] w-80 shrink-0 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className='flex justify-between items-start'>
                <div>
                    <h2 className="font-bold text-lg">{title}</h2>
                    <p className='text-sm text-neutral-500'>{tasks.length} tasks </p>
                </div>
                <div className='relative'>
                    <button onClick={()=>setOpenOptions(!openOptions)} className='rounded-lg p-2 cursor-pointer hover:bg-neutral-200 transition '>
                        <BsThreeDotsVertical />
                    </button>
                    {openOptions && (<div className="absolute top-full mt-2  right-0 z-20">
                        <OptionsMenu setOptions={setOpenOptions} options = {[{icon:<FaEdit />,title:'Edit',onClick:()=>{
                            setOpenEdit(true)
                            }},{icon:<MdDelete />,title:'Delete',onClick:()=>{
                                handleDelete()
                                }}]} />
                    </div> )}
                </div>
            </div>
            <div className='h-px bg-neutral-200 my-4'></div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
                {tasks.length === 0 ? (
                    <div className='h-full flex flex-col justify-center items-center gap-4'>
                        <h3 className='text-xl font-bold'>No tasks yet!</h3>
                        <div className='text-lg text-neutral-600 font-medium max-w-xs w-full text-center'>Create your first task</div>

                    </div>
                ) : (
                    <div className='space-y-3'>
                        {tasks.map(task => {
                            return <TaskCard />
                        })}
                    </div>
                )
                }
            </div>
            <button className='mt-4 w-full rounded-lg py-2 hover:bg-neutral-200 transition text-lg font-semibold cursor-pointer '>+Add Task</button>
        </div>
    )
}

export default ColumnCard
