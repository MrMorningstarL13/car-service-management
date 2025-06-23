import useUserStore from "../stores/userStore"
import { useNavigate } from 'react-router'
import {default as CarBackground} from '../components/CarBackground'
// If you have a type declaration file for CarBackground, e.g., src/types/CarBackground.d.ts,
// make sure it contains: declare module '../components/CarBackground';
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
    }, [loggedIn])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <CarBackground/>
            <div className="bg-black/50 rounded-3xl flex items-center justify-center absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 h-[35vh] w-[25vw]">
                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[2.5rem] text-secondary mb-10 font-bold">AutoMate</h2>
                            <label className="text-white text-xl">Email</label>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                            <label className="text-white text-xl">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-4 py-2 px-4 bg-secondary hover:bg-tertiary text-white font-medium cursor-pointer rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                        >
                            Log in
                        </button>
                    </form>
                    <a
                        href="/signup"
                        className="text-white hover:text-secondary hover:underline mt-4 block text-center font-medium transition-colors duration-200"
                    >
                        Don't have an account? Create one now
                    </a>
                </div>
            </div>
        </>
    )
}