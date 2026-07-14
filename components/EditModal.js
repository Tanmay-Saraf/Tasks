import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';

const EditModal = ({oldTitle,id,onChange,fetchBoards}) => {
    const modelRef = useRef();
    const [title, setTitle] = useState(oldTitle);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const handleClose = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)) {
                onChange(false);
            }
        }
        document.addEventListener('mousedown', handleClose);
        return () => {
            document.removeEventListener('mousedown', handleClose);
        }
    }, [onChange]);
    useEffect(() => {
        const handleEsc = (e) => {
            if (loading) return;
            if (e.key === 'Escape') {
                onChange(false);
            }
        }
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        }
    }, [loading,onChange])
    const handleClick = async () => {
        try {
            const trimmedTitle = title.trim();
            if (!trimmedTitle) {
                toast.error('Title cannot be empty or empty spaces');
                return;
            }
            if (trimmedTitle.length > 100) {
                toast.error('Title cannot exceed 100 characters');
                return;
            }
            setLoading(true)
            const res = await fetch('/api/boards', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: trimmedTitle ,id}),
            })
            const data = await res.json();
            if (!data.success) {
                console.error(data.message);
                toast.error(data.message);
                return;
            }
            await fetchBoards();
            setTitle("");
            onChange(false);
            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }
    return (

        <div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center bg-black/40 z-50'>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleClick()
            }} ref={modelRef} className=' min-w-[30vw] flex flex-col gap-6 bg-zinc-200 border border-neutral-300 shadow-2xl p-4 rounded-xl'>
                <h1 className='text-2xl text-center font-black tracking-wide '>Update Board Title</h1>
                <input disabled={loading} autoFocus value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='New Board Title' className='w-full shadow-md placeholder:text-neutral-400 text-neutral-600 border border-neutral-200  px-4 py-2 outline-none focus:ring focus:ring-neutral-300 bg-white rounded-xl' />
                <div className='flex justify-center items-center gap-2'>
                    <button type='button' disabled={loading} onClick={() => { onChange(false) }} className={`shadow-lg ${loading ? 'bg-neutral-700' : 'bg-neutral-800'} text-white px-4 py-2 rounded-xl text-md font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 `} >Cancel</button>
                    <button type='submit' disabled={loading} className={`shadow-lg ${loading ? 'bg-neutral-700' : 'bg-neutral-800'} text-white px-4 py-2 rounded-xl text-md font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 `}>{loading ? 'Updating' : 'Update'}</button>
                </div>
            </form>
        </div>
    )
}

export default EditModal
