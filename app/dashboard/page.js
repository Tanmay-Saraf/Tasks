'use client'
import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import Dropdown from '@/components/Dropdown';
import { toast } from 'react-toastify';
import CreateBoard from '@/components/CreateBoard';

const page = () => {
  const [createOpen,setCreateOpen] = useState(true);
  const [sort, setSort] = useState('Newest')
  const [boards, setBoards] = useState([])
  const [page,setPage] = useState(1);
  const [query,setQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [totalBoards,setTotalBoards] = useState(0);
  const [totalPages,setTotalPages] = useState(0);
  const [debouncedQuery,setDebouncedQuery] = useState("");
  const fillData = async ()=>{
    try {
      const res = await fetch(`/api/boards?page=${page}&limit=${20}&query=${encodeURIComponent(debouncedQuery)}&sort=${sort}`);
      const data = await res.json();
      if(!data.success){
        console.error(data.message);
        toast.error(data.message);
      }
      setBoards(data.boards);
      setTotal(data.total);
      setTotalBoards(data.totalBoards);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
  }
  useEffect(()=>{
    fillData();
  },[page,debouncedQuery,sort]);
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setPage(1);
      setDebouncedQuery(query.trim());
    },300)
    return ()=>clearTimeout(timer)
  },[query])

  return (
    <div className='mt-18'>
      {createOpen && <CreateBoard/>}
      <h1 className='text-center font-black text-3xl mb-4 mt-4'>Dashboard</h1>
      <div className='w-full flex gap-4 px-8'>
        <span className='flex-1 relative '>
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='Search' className='w-full shadow-md px-10 py-2 placeholder:text-neutral-400 text-neutral-600 border border-neutral-200 outline-none focus:ring-1 focus:ring-neutral-300 rounded-xl' type="text" />
          <CiSearch className='absolute top-1/2 -translate-y-1/2 left-2 text-xl' />
        </span>
        <button className='flex justify-center items-center bg-neutral-800 text-white px-4 py-2 rounded-xl text-md font-medium shadow-lg cursor-pointer hover:-translate-y-0.5 transition-all duration-300 gap-1'><span className='font-black'><IoMdAdd /></span>Add Board</button>
        <Dropdown placeholder='Sort' value={sort} options={['Newest', 'Oldest', 'A-Z', 'Z-A']} onChange={setSort} />
      </div>
      <p className='text-center text-2xl mb-2 mt-4 font-bold '>Manage all your boards</p>
      {boards.length!==0&&<p className='text-center text-md'>You are seeing {boards.length} of {total} boards</p>}
      <div className={`boards ${boards.length === 0 ? "mt-20" : 'mt-8 px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6'} `}>
        {boards.length === 0 && (
          <div className="flex justify-center items-center ">
            <div className='flex flex-col justify-center items-center gap-4 bg-zinc-100 border border-neutral-200 shadow-lg p-6 rounded-xl'>
              <h3 className='text-xl font-bold'>No boards yet!</h3>
              <div className='text-lg text-neutral-600 font-medium max-w-xs w-full text-center'>Create your first Board to start organizing your work</div>
              <button className='w-full bg-black text-white px-4 py-2 rounded-xl font-medium text-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex justify-center items-center gap-2'><span className='font-black'><IoMdAdd /></span><span>Create Board</span></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default page