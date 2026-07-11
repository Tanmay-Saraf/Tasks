'use client'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { SiGithub } from "react-icons/si";

const Login = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false);
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const trimmedEmail = form.email?.trim();
            const trimmedPassword = form.password?.trim();
            if (!trimmedEmail || !trimmedPassword) {
                toast.error("All fields are required!")
                return;
            }
            const res = await signIn('credentials', {
                email: trimmedEmail,
                password: form.password,
                redirect: false,
            })
            if (res?.ok) {
                toast.success('Logged in Successfully')
                router.replace('/dashboard');
            } else {
                toast.error('Invalid credentials')
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong')
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='bg-zinc-100 border border-neutral-300 mx-auto my-auto max-w-xl p-8 rounded-3xl shadow-xl'>
            <h1 className='text-center text-3xl font-bold tracking-widest'>TASks</h1>
            <p className='text-center mb-6 text-sm font-medium text-neutral-600'>Organize your work efficiently</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <form className='md:border-r md:pr-4 md:border-b-0 md:pb-0 border-b pb-4 border-neutral-300 flex flex-col gap-4' onSubmit={(e) => handleClick(e)}>
                    <div>
                        <label className='text-neutral-600 text-md pl-1 font-semibold' htmlFor="email">Email</label>
                        <input autoComplete='email' placeholder='example@abc.com' className='placeholder:text-neutral-400 text-neutral-600 w-full bg-zinc-50 border border-neutral-200 outline-none focus:ring-1 focus:ring-neutral-300 rounded-xl px-2 py-1' id='email' type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                        <label className='text-neutral-600 text-md pl-1 font-semibold' htmlFor="password">Password</label>
                        <input autoComplete='current-password' className='text-neutral-600 w-full bg-zinc-50 border border-neutral-200 outline-none focus:ring-1 focus:ring-neutral-300 rounded-xl px-2 py-1' id='password' type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <button disabled={loading} className='w-full cursor-pointer hover:-translate-y-0.5 bg-black text-white text-lg font-semibold rounded-xl px-2 py-1 transition duration-300' type='submit'>{loading ? 'Logging in' : 'Log in'}</button>
                </form>
                <div className='my-auto mx-auto'>
                    <button className='w-full bg-zinc-50 px-4 py-2 rounded-xl border border-neutral-200 text-lg font-semibold flex justify-center items-center gap-2 cursor-pointer hover:border hover:border-neutral-400 hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-300' disabled={loading} onClick={
                        async () => {
                            await signIn('github', { callbackUrl: '/dashboard' })
                        }
                    }
                    ><SiGithub /> Log in with Github</button>
                </div>
            </div>
            <p className='text-center mt-6 text-sm text-neutral-600 '>Don't have an account? <Link className='text-neutral-800 font-medium underline cursor-pointer' href={'/signup'}> Sign Up</Link></p>
        </div>
    )
}

export default Login
