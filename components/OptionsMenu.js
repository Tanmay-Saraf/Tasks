import React, { useEffect, useRef } from 'react'

const OptionsMenu = ({options,setOptions}) => {
    const optionsRef = useRef()
    useEffect(()=>{
        const handleClose = (e)=>{
            if(optionsRef.current && !optionsRef.current.contains(e.target)){
                setOptions(false);
            }
        }
        document.addEventListener('mousedown',handleClose);
        return ()=>document.removeEventListener('mousedown',handleClose);
    },[setOptions])
  return (
    <div ref={optionsRef} className='flex flex-col bg-white border border-neutral-200 p-2 min-w-20 shadow-lg rounded-xl'>
        {options.map((option,idx)=>{
          return  <button className='rounded-lg inline-flex justify-center p-2 hover:bg-neutral-100 transition cursor-pointer' key={idx} title={option.title} onClick={()=>{
            option.onClick()
            setOptions(false);
          }}>{option.icon}</button>
        })}
    </div>
  )
}

export default OptionsMenu
