'use client'
import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import Dropdown from '@/components/Dropdown';
import { toast } from 'react-toastify';
import BoardCard from '@/components/BoardCard';
import BoardCardSkeleton from '@/components/BoardCardSkeleton';
import CreateModal from '@/components/CreateModal';

const page = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [sort, setSort] = useState('Newest')
  const [boards, setBoards] = useState([])
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [totalBoards, setTotalBoards] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [boardTitle,setBoardTitle] = useState('');
  const [createLoading,setCreateLoading] = useState(false);
  const fetchBoards = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/boards?page=${page}&limit=${20}&query=${encodeURIComponent(debouncedQuery)}&sort=${sort}`);
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
      }
      setBoards(data.boards);
      setTotal(data.total);
      setTotalBoards(data.totalBoards);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchBoards();
  }, [page, debouncedQuery, sort]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedQuery(query.trim());
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleCreateBoard = async () => {
    try {
      const trimmedTitle = boardTitle.trim();
      if(!trimmedTitle){
        toast.error('Title cannot be empty or empty spaces');
        return ;
      }
      if(trimmedTitle.length>100){
        toast.error('Title cannot exceed 100 characters');
        return ;
      }
      setCreateLoading(true)
      const res = await fetch('/api/boards', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title:trimmedTitle }),
      })
      const data = await res.json();
      if(!data.success){
        console.error(data.message);
        toast.error(data.message);
        return;
      }
      await fetchBoards();
      setBoardTitle("");
      setCreateOpen(false);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }finally{
      setCreateLoading(false);
    }
  }
  return (
    <div className='mt-18'>
      {createOpen && <CreateModal heading={'Create Board'} placeholder={'Board Title'} buttonText={'Create'} submitingText={'Creating'} title={boardTitle} setTitle={setBoardTitle} loading={createLoading} onCancel={()=>setCreateOpen(false)} onSubmit={()=>handleCreateBoard()}/> }
      <h1 className='text-center font-black text-3xl mt-4 mb-2'>Dashboard</h1>
      {boards?.length !== 0 && <p className='text-center mb-4 text-md'>{total} boards</p>}
      <div className='w-full flex gap-4 px-8'>
        <span className='flex-1 relative '>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search' className='w-full shadow-md px-10 py-2 placeholder:text-neutral-400 text-neutral-600 border border-neutral-200 outline-none focus:ring-1 focus:ring-neutral-300 rounded-xl' type="text" />
          <CiSearch className='absolute top-1/2 -translate-y-1/2 left-2 text-xl' />
        </span>
        <button disabled={createLoading} className='flex justify-center items-center bg-neutral-800 text-white px-4 py-2 rounded-xl text-md font-medium shadow-lg cursor-pointer hover:-translate-y-0.5 transition-all duration-300 gap-1' onClick={() => setCreateOpen(true)}><span className='font-black'><IoMdAdd /></span>Add Board</button>
        <Dropdown placeholder='Sort' value={sort} options={['Newest', 'Oldest', 'A-Z', 'Z-A']} onChange={setSort} />
      </div>
      <p className='text-center text-2xl mb-2 mt-4 font-bold '>Manage all your boards</p>
      <div className={`boards ${(loading || boards.length > 0) ? "mt-8 px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6" : "mt-20"}`}>
        {loading && (
          Array.from({ length: 8 }).map((_, index) => {
            return <BoardCardSkeleton key={index} />
          })
        )}
        {(!loading && boards?.length === 0 && debouncedQuery !== "") && (
          <div className='flex justify-center items-center'>
            <div className='text-lg'>No results found</div>
          </div>
        )}
        {(!loading && boards?.length === 0 && debouncedQuery === "") && (
          <div className="flex justify-center items-center ">
            <div className='flex flex-col justify-center items-center gap-4 bg-zinc-100 border border-neutral-200 shadow-lg p-6 rounded-xl'>
              <h3 className='text-xl font-bold'>No boards yet!</h3>
              <div className='text-lg text-neutral-600 font-medium max-w-xs w-full text-center'>Create your first Board to start organizing your work</div>
              <button onClick={()=>setCreateOpen(true)} className='w-full bg-black text-white px-4 py-2 rounded-xl font-medium text-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex justify-center items-center gap-2'><span className='font-black'><IoMdAdd /></span><span>Create Board</span></button>
            </div>
          </div>
        )}
        {!loading && boards.length !== 0 &&
          (
            boards?.map(item => {
              return <BoardCard key={item._id} title={item.title} createdAt={item.createdAt} id={item._id} fetchBoards={fetchBoards} />
            })
          )}
      </div>
      <div className="buttons mt-10 mb-10 flex justify-center items-center gap-6 bg-neutral-200 w-fit mx-auto rounded-xl px-6 py-3">
        <button className='disabled:cursor-not-allowed cursor-pointer font-semibold text-xl  hover:-translate-y-0.5  transition-all duration-300' onClick={() => setPage(page - 1)} disabled={page === 1}>&larr; Prev</button>
        <span>{page} of {totalPages}</span>
        <button className='disabled:cursor-not-allowed cursor-pointer font-semibold text-xl  hover:-translate-y-0.5  transition-all duration-300' onClick={() => { setPage(page + 1) }} disabled={page === totalPages}>Next &rarr;</button>
      </div>
    </div>
  )
}

export default page