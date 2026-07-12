'use client'
import { useState, useRef, useEffect } from "react"
import React from 'react'
import { FiChevronDown } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";

const Dropdown = ({ placeholder = "Select", value, options, onChange }) => {
    const [open, setOpen] = useState(false);
    const dropDownRef = useRef();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);
    return (
        <div className="relative inline-block" ref={dropDownRef}>
            <button type="button" className='px-4 min-w-36 py-2 bg-neutral-800 text-white rounded-xl flex justify-between items-center gap-3 shadow-lg cursor-pointer hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-500 text-md font-medium duration-300 select-none' onClick={() => setOpen(!open)}>
                <span>{value||placeholder}</span>
                <FiChevronDown className={`transition-transform duration-200 ${open?"rotate-180":""}`}/>
            </button>
            {open && (
                <div className="absolute min-w-36 top-12 left-0 p-1 flex flex-col gap-1 w-full bg-neutral-800 text-white rounded-xl shadow-xl border border-neutral-700 z-100">
                    {options.map(item => {
                        return (
                            <button
                            type="button"
                             className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${value===item?"bg-neutral-700":"hover:bg-neutral-700"}`} 
                             key={item} 
                             onClick={() => {
                                setOpen(false)
                                onChange(item)
                            }}>
                                <span>{item}</span>
                                <span className="w-4 flex justify-center">{value === item ? <FaCheck size={12} /> : null}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Dropdown
