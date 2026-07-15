import React from 'react'
import { intlFormatDistance } from 'date-fns';
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import ColumnCard from './ColumnCard';

const BoardPage = ({board,columns}) => {
    const title = board.title;
    const createdAt = board.createdAt;
  return (
    <div>
        <div className="flex justify-between px-4 py-4">
            <div>
                <Link href={'/dashboard'} className='text-md font-semibold flex items-center justify-center gap-2 text-neutral-600 hover:text-black transition'><span><FaArrowLeft size={15}/></span>Dashboard</Link>
            </div>
            <div className='text-md font-semibold flex items-center justify-center gap-2 text-neutral-600'>
                Created <span className='text-lg font-bold text-black'>{intlFormatDistance(createdAt,Date.now())}</span>
            </div>
        </div>
        <h1 className='text-center text-3xl font-black '>{title}</h1>
        <div className={`flex gap-6 overflow-x-auto no-scrollbar px-8 py-8 ${columns.length===0?"justify-center mt-40":""}`}>
            {columns.map(item=>{
                return <ColumnCard key={item._id} title={item.title} tasks={item.tasks}/>
            })}
            <div className="addColumn  flex justify-center items-center">
                <div className='bg-zinc-100 w-80 shrink-0 h-40 flex justify-center items-center text-xl rounded-xl border border-neutral-200 font-bold  cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-lg'><IoAdd size={30}/> Add Column</div>
            </div>
        </div>
    </div>
  )
}

export default BoardPage
