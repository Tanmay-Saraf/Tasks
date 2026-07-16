'use client'
import React, { useEffect, useRef } from 'react'

const CreateModal = ({ heading,placeholder,buttonText,title,setTitle,loading,onCancel ,onSubmit,submitingText}) => {
  const modelRef = useRef();
  useEffect(() => {
    const handleClose = (e) => {
      if(loading)return ;
      if (modelRef.current && !modelRef.current.contains(e.target)) {
        onCancel();
      }
    }
    document.addEventListener('mousedown', handleClose);
    return () => {
      document.removeEventListener('mousedown', handleClose);
    }
  }, [onCancel]);
  useEffect(()=>{
    const handleEsc = (e)=>{
      if(loading)return;
      if(e.key==='Escape'){
        onCancel();
      }
    }
    document.addEventListener('keydown',handleEsc);
    return ()=>{
      document.removeEventListener('keydown',handleEsc);
    }
  },[loading,onCancel])
  
  return (
    <div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center bg-black/40 z-50'>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }} ref={modelRef} className=' min-w-[30vw] flex flex-col gap-6 bg-zinc-200 border border-neutral-300 shadow-2xl p-4 rounded-xl'>
        <h1 className='text-2xl text-center font-black tracking-wide '>{heading}</h1>
        <input disabled={loading} autoFocus value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder={placeholder} className='w-full shadow-md placeholder:text-neutral-400 text-neutral-600 border border-neutral-200  px-4 py-2 outline-none focus:ring focus:ring-neutral-300 bg-white rounded-xl' />
        <div className='flex justify-center items-center gap-2'>
          <button type='button' disabled={loading} onClick={() => onCancel()} className={`shadow-lg ${loading?'bg-neutral-700':'bg-neutral-800'} text-white px-4 py-2 rounded-xl text-md font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 `} >Cancel</button>
          <button type='submit' disabled={loading}  className={`shadow-lg ${loading?'bg-neutral-700':'bg-neutral-800'} text-white px-4 py-2 rounded-xl text-md font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 `}>{loading?submitingText:buttonText}</button>
        </div>
      </form>
    </div>
  )
}

export default CreateModal
