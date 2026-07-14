import React,{useState} from 'react'
import { intlFormatDistance } from 'date-fns'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Link from 'next/link'
import EditModal from './EditModal';
import { toast } from 'react-toastify';
import ConfirmModel from './ConfirmModel';

const BoardCard = ({title,createdAt,id,fetchBoards}) => {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openConfirmModal,setOpenConfirmModal] = useState(false);
  const handleDelete = async ()=>{
    try {
      const res = await fetch('/api/boards',{
        method:'DELETE',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({id}),
      })
      const data = await res.json();
      if(!data.success){
        toast.error(`Couldn't Delete , ${data.message}`);
        return ;
      }
      await fetchBoards();
      setOpenConfirmModal(false);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong')
    }
  }
  return (
    <div>
        {openEditModal && ( <EditModal id={id} oldTitle={title} onChange={setOpenEditModal} fetchBoards={fetchBoards} /> )}
        {openConfirmModal && (<ConfirmModel title={'Delete Board'} question={'Are you Sure you want to delete this board?'} confirmText={'Delete'} cancelText={'Cancel'} onCancel = {()=>setOpenConfirmModal(false)} onSubmit = {handleDelete} />)}
      <div  className='relative bg-white p-4 rounded-xl border border-neutral-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer'>
          <div className='absolute right-4 top-4 flex gap-2'>
            <button onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              setOpenEditModal(true)
              }}  title={'Edit'} className='cursor-pointer text-neutral-500 hover:text-neutral-900 transition'><FaEdit size={20} /></button>
            <button onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              setOpenConfirmModal(true);
              }} title={'Delete'} className='cursor-pointer text-neutral-500 hover:text-neutral-900 transition'><MdDelete size={20} /></button>
          </div>
        <Link href={`/boards/${encodeURIComponent(id)}`}>
          <h1 title={title} className='my-10 text-xl font-semibold line-clamp-2'>{title}</h1>
          <p className='text-neutral-500  text-sm absolute right-4 bottom-4' title={new Date(createdAt).toLocaleString()}>Created <span className='font-semibold'>{intlFormatDistance(new Date(createdAt),Date.now())}</span></p>
        </Link>
      </div>
    </div>
  )
}

export default BoardCard
