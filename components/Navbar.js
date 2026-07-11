import React from 'react'
import { auth} from '@/lib/auth'
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const Navbar = async() => {
    const session = await auth();
    
  return (
    <div className='flex justify-between px-6 py-3 fixed top-0 w-full border-b border-neutral-300 '>
      <Link href={'/'} className='text-3xl font-black tracking-widest '>TASks</Link>
      <div className='flex justify-center items-center gap-4'>
        {!session && (
            <Link className='text-lg font-semibold cursor-pointer hover:-translate-y-0.5 transition duration-300' href={'/login'}>Log In</Link>
        )}
        {!session && (
            <Link className='text-lg font-semibold cursor-pointer hover:-translate-y-0.5 transition duration-300' href={'/signup'}>Sign Up</Link>
        )}
        {session && (
            <Link className='text-lg font-semibold cursor-pointer hover:-translate-y-0.5 transition duration-300' href={'/dashboard'}>Dashboard</Link>
        )}
        {session && (
            <LogoutButton />
        )}
      </div>
    </div>
  )
}

export default Navbar
