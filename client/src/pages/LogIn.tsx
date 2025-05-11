import useUserStore from "../stores/userStore"
import { useNavigate } from 'react-router'

import { useState, useEffect } from 'react'
import { useAuthStore } from "../stores/useAuthStore";
export default function LogIn() {

    const { logIn } = useUserStore();
    const { loggedIn } = useAuthStore();
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await logIn(formData);
    }

    useEffect(() => {
        if (loggedIn) {
            navigate("/");
        }
    },[loggedIn])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
      
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }; 

    return (
        <main className="min-h-screen bg-[#f8f9f4] flex items-center justify-center">
            <div className="bg-primary rounded-xl p-4">
                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col">
                        <label className="text-black">Email</label>
                        <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none" />
                        <label className="text-black">Password</label>
                        <input type="text" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none" />
                    </div>
                    <button type="submit">Log in</button>
                </form>
                <a href="/signup" className="text-blue-500 hover:underline mt-4 block text-center">Don't have an account? Create one now</a>
            </div>
        </main>
    )
}