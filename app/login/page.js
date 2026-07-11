'use client'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const Login = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading,setLoading] = useState(false);
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
        }finally{
            setLoading(false);
        }
    }
    return (
        <div>
            <form onSubmit={(e) => handleClick(e)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id='email' type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id='password' type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <button disabled={loading} type='submit'>{loading ? 'Logging in' : 'Log in'}</button>
            </form>
            <div>
                <button disabled={loading} onClick={
                    async () => {
                        await signIn('github', { callbackUrl: '/dashboard' })
                    }
                }
                >Log in with Github</button>
            </div>
        </div>
    )
}

export default Login
