'use client'
import React, { useState } from 'react'
import { intlFormatDistance } from 'date-fns';
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import ColumnCard from './ColumnCard';
import CreateModal from './CreateModal'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const BoardPage = ({ board, columns }) => {
    const router = useRouter();
    const title = board.title;
    const createdAt = board.createdAt;
    const [editModal, setEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [columnTitle, setColumnTitle] = useState('');
    const handleTitleSubmit = async () => {
        try {
            const trimmedTitle = columnTitle.trim();
            if (!trimmedTitle) {
                toast.error('Title cannot be empty or empty spaces');
                return;
            }
            if (trimmedTitle.length > 100) {
                toast.error('Title cannot exceed 100 characters')
                return;
            }
            setLoading(true);
            const res = await fetch('/api/columns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: trimmedTitle,boardId:board._id })
            });
            const data = await res.json();
            if (!data.success) {
                console.error(data.message);
                toast.error(data.message);
                return;
            }
            setColumnTitle('');
            setEditModal(false);
            router.refresh();
            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }finally{
            setLoading(false);
        }
    }
    return (
        <div>
            {editModal && <CreateModal heading={'Create Column'} placeholder={'Column Title'} buttonText={'Create'} title={columnTitle} setTitle={setColumnTitle} loading={loading} onCancel={() => setEditModal(false)} onSubmit={() => handleTitleSubmit()} submitingText={'Creating'} />}
            <div className="flex justify-between px-4 py-4">
                <div>
                    <Link href={'/dashboard'} className='text-md font-semibold flex items-center justify-center gap-2 text-neutral-600 hover:text-black transition'><span><FaArrowLeft size={15} /></span>Dashboard</Link>
                </div>
                <div className='text-md font-semibold flex items-center justify-center gap-2 text-neutral-600'>
                    Created <span className='text-lg font-bold text-black'>{intlFormatDistance(createdAt, Date.now())}</span>
                </div>
            </div>
            <h1 className='text-center text-3xl font-black '>{title}</h1>
            <div className={`flex gap-6 overflow-x-auto no-scrollbar px-8 py-8 ${columns.length === 0 ? "justify-center mt-40" : ""}`}>
                {columns.map(item => {
                    return <ColumnCard key={item._id} id={item._id} title={item.title} tasks={item.tasks} />
                })}
                <div className="addColumn  flex justify-center items-center">
                    <button onClick={() => setEditModal(true)} className='bg-zinc-100 w-80 shrink-0 h-40 flex justify-center items-center text-xl rounded-xl border border-neutral-200 font-bold  cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-lg'><IoAdd size={30} /> Add Column</button>
                </div>
            </div>
        </div>
    )
}

export default BoardPage
