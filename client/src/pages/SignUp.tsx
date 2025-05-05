import useUserStore from "../stores/userStore";
import { useState } from "react";

export default function SignUp() {

    const { createUser } = useUserStore();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        dateOfBirth: new Date(),
        isAdmin: false,
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await createUser(formData);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
      
        setFormData((prev) => ({
          ...prev,
          [name]: name === "dateOfBirth" ? new Date(value) : value,
        }));
      };      

    return (
        <main className="min-h-screen bg-[#f8f9f4] flex items-center justify-center">
            <div className="bg-primary rounded-xl p-4">
                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col">
                        <label className="text-black">First name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none" />
                        <label className="text-black">Last name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none" />
                        <label className="text-black">Email</label>
                        <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none" />
                        <label className="text-black">Password</label>
                        <input type="text" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none" />
                        <label className="text-black">Date of birth</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth.toISOString().split("T")[0]} onChange={handleChange} className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none" />
                        <label className="text-black">Phone number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none" />
                    </div>
                    <button type="submit">Sign up</button>
                </form>

            </div>
        </main>
    )
}