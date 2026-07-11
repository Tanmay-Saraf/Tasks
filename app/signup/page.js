'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const Signup = () => {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const trimmedName = form.name?.trim();
            const trimmedEmail = form.email?.trim();
            const trimmedPassword = form.password?.trim();
            if (!trimmedName || !trimmedEmail || !trimmedPassword) {
                toast.error("All fields are required!")
                return ;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(trimmedEmail)) {
                toast.error('Please enter a valid email address')
                return ;
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
            if (!passwordRegex.test(form.password)) {
                toast.error("Password must be atleast 8 characters long and include uppercase , lowercase , a number and a special character");
                return ;
            }
            const res = await fetch('/api/signup',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({name:trimmedName,email:trimmedEmail,password:form.password}),
            })
            const data = await res.json();
            if(data.success){
                setForm({ name: "", email: "", password: "" });
                toast.success(data.message);
                router.push('/login')
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='bg-zinc-100 border border-neutral-300 mx-auto my-auto max-w-xl min-w-md p-8 rounded-3xl shadow-xl'>
            <h1 className='text-center text-3xl font-bold'>Welcome to <span className='tracking-widest'>TASks</span></h1>
            <h3 className='text-center mb-6 text-sm font-medium text-neutral-600'>Create an account</h3>
            <form className='flex flex-col gap-4' onSubmit={(e) => {
                handleSubmit(e);
            }}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input placeholder='Full Name' id='name' type="text" autoComplete='name' value={form.name} className='placeholder:text-neutral-400 text-neutral-600 w-full bg-zinc-50 border border-neutral-200 outline-none focus:ring-1 focus:ring-neutral-300 rounded-xl px-2 py-1' onChange={(e) => {
                        setForm({ ...form, name: e.target.value })
                    }} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input placeholder='example@abc.com' id='email' type="email" autoComplete='email' value={form.email} className='placeholder:text-neutral-400 text-neutral-600 w-full bg-zinc-50 border border-neutral-200 outline-none focus:ring-1 focus:ring-neutral-300 rounded-xl px-2 py-1' onChange={(e) => {
                        setForm({ ...form, email: e.target.value })
                    }} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id='password' type="password" autoComplete='new-password' value={form.password} className='text-neutral-600 w-full bg-zinc-50 border border-neutral-200 outline-none focus:ring-1 focus:ring-neutral-300 rounded-xl px-2 py-1' onChange={(e) => {
                        setForm({ ...form, password: e.target.value })
                    }} />
                </div>
                <button disabled={loading} className='w-full cursor-pointer hover:-translate-y-0.5 bg-black text-white text-lg font-semibold rounded-xl px-2 py-1 transition duration-300' type='submit'>{loading ? 'Creating account' : 'Sign Up'}</button>
                <p className='text-center mt-6 text-sm text-neutral-600 '>Already have an account? <Link className='text-neutral-800 font-medium underline cursor-pointer' href={'/login'}>Log in</Link></p>
            </form>
        </div>
    )
}

export default Signup
