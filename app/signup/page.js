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
        <div>
            <form onSubmit={(e) => {
                handleSubmit(e);
            }}>
                <h1>Welcome to Tasks</h1>
                <h3>Create an account</h3>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id='name' type="text" autoComplete='name' value={form.name} onChange={(e) => {
                        setForm({ ...form, name: e.target.value })
                    }} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id='email' type="email" autoComplete='email' value={form.email} onChange={(e) => {
                        setForm({ ...form, email: e.target.value })
                    }} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id='password' type="password" autoComplete='new-password' value={form.password} onChange={(e) => {
                        setForm({ ...form, password: e.target.value })
                    }} />
                </div>
                <button disabled={loading} type='submit'>{loading ? 'Creating account' : 'Sign Up'}</button>
                <p>Already have an account? <Link href={'/login'}>Log in</Link></p>
            </form>
        </div>
    )
}

export default Signup
