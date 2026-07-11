'use client'
import React from 'react'
import { signOut } from 'next-auth/react'

const LogoutButton = () => {
    return (
        <button className='text-lg font-semibold cursor-pointer hover:-translate-y-0.5 transition duration-300' onClick={async () => {
            await signOut({
                callbackUrl:'/',
            })
        }}>Log Out</button>
    )
}

export default LogoutButton
