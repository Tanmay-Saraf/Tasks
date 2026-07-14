import React from 'react'

const ConfirmModel = ({title,question,onCancel,onSubmit,confirmText,cancelText}) => {
  return (
    <div className='absolute top-2 left-1/2 -translate-x-1/2 p-4 rounded-xl border border-neutral-400 bg-zinc-200 '>
      <h1 className='text-xl font-bold text-center mb-4'>{title}</h1>
      <h3 className='text-center text-lg font-semibold mb-4'>{question}</h3>
      <div className='flex gap-4 justify-center items-center'>
          <button className='bg-black px-4 py-2 rounded-xl text-white text-md font-semibold hover:-translate-y-1 transition duration-300 cursor-pointer' onClick={()=>onCancel()}>{cancelText}</button>
          <button className='bg-black px-4 py-2 rounded-xl text-white text-md font-semibold hover:-translate-y-1 transition duration-300 cursor-pointer' onClick={()=>onSubmit()}>{confirmText}</button>
      </div>
    </div>
  )
}

export default ConfirmModel
