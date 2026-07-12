import React from 'react'

const CreateBoard = () => {
  return (
    <div className='fixed top-4 left-1/2 -translate-x-1/2 flex flex-col gap-6 bg-zinc-200 p-4 z-150 rounded-xl'>
      <h1 className='text-2xl text-center font-black tracking-wide '>Create Board</h1>
      <input type="text" placeholder='Board Title' className='w-full shadow-md placeholder:text-neutral-400 text-neutral-600 border border-neutral-200  px-4 py-2 outline-none focus:ring focus:ring-neutral-300 bg-white rounded-xl' />
      <div className='flex justify-center items-center gap-2'>
        <button className='shadow-lg bg-neutral-800 text-white px-4 py-2 rounded-xl text-md font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 ' >Cancel</button>
        <button className='shadow-lg bg-neutral-800 text-white px-4 py-2 rounded-xl text-md font-medium cursor-pointer hover:-translate-y-0.5 transition-all duration-300 '>Create</button>
      </div>
    </div>
  )
}

export default CreateBoard
