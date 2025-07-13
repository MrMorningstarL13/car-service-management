import useUserStore from "../stores/userStore";
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";
import { default as CarBackground } from '../components/CarBackground'


export default function SignUp() {
    const navigate = useNavigate();
    const { loggedIn } = useAuthStore();
    const { createUser } = useUserStore();
    const [authUserData, setAuthUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "customer"
    })

    const [userData, setUserData] = useState({
        phone: "",
        dateOfBirth: new Date(),
    })

    const [employeeData, setEmployeeData] = useState({
        hireDate: new Date(),
        position: "",
        experienceLevel: "",
        salary: 0,
        isRep: true,
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const entity = authUserData.role === "customer" ? { user: userData } : { employee: employeeData }

        navigate('/login')
        await createUser(authUserData, entity);
    }

    useEffect(() => {
        if (loggedIn) {
            navigate("/");
        }
    }, [loggedIn])

    const handleAuthUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setAuthUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData(prev => ({
            ...prev,
            [name]: name === "dateOfBirth" ? new Date(value) : value
        }))
    }

    const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setEmployeeData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : name === "hireDate" ? new Date(value) : value
        }))
    }

    return (
        <>
            <CarBackground />
            <main className={`bg-black/50 rounded-3xl flex items-center justify-center absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 ${authUserData.role === "customer" ? 'h-[69vh]' : 'h-[79vh]'} w-[25vw]`}>
                <div className="p-4">
                    <form onSubmit={handleSubmit}>

                        <div className="flex flex-col gap-3">
                            <h2 className="text-[2.5rem] text-secondary mb-10 font-bold">AutoMate</h2>
                            <label className="text-white text-xl">First name</label>
                            <input type="text" name="firstName" value={authUserData.firstName} onChange={handleAuthUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                            <label className="text-white text-xl">Last name</label>
                            <input type="text" name="lastName" value={authUserData.lastName} onChange={handleAuthUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                            <label className="text-white text-xl">Email</label>
                            <input type="text" name="email" value={authUserData.email} onChange={handleAuthUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                            <label className="text-white text-xl">Password</label>
                            <input type="password" name="password" value={authUserData.password} onChange={handleAuthUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                            <label className="text-white text-xl">Please select your role</label>
                            <select
                                name="role"
                                value={authUserData.role}
                                onChange={handleAuthUserChange}
                                className="w-full my-2 px-4 py-2 rounded-md border border-secondary bg-transparent text-secondary focus:outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/50 transition-all duration-150"
                            >
                                <option value="customer" className="bg-black">Customer</option>
                                <option value="employee" className="bg-black">Service Rep</option>
                            </select>


                            {authUserData.role === "customer" && (
                                <>
                                    <label className="text-white text-xl">Date of birth</label>
                                    <input type="date" name="dateOfBirth" value={userData.dateOfBirth.toISOString().split("T")[0]} onChange={handleUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                                    <label className="text-white text-xl">Phone number</label>
                                    <input type="text" name="phone" value={userData.phone} onChange={handleUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                                </>
                            )}

                            {authUserData.role === "employee" && (
                                <>
                                    <label className="text-white text-xl">Hire date</label>
                                    <input type="date" name="dateOfBirth" value={employeeData.hireDate.toISOString().split("T")[0]} onChange={handleEmployeeChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                                    <label className="text-white text-xl">Position occupied</label>
                                    <input type="text" name="position" value={employeeData.position} onChange={handleEmployeeChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                                    <label className="text-white text-xl">Experience level</label>
                                    <input type="text" name="experienceLevel" value={employeeData.experienceLevel} onChange={handleEmployeeChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                                    <label className="text-white text-xl">Current salary</label>
                                    <input type="number" name="salary" value={employeeData.salary} onChange={handleEmployeeChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-secondary focus:outline-none" />
                                </>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-4 py-2 px-4 bg-secondary hover:bg-tertiary text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                        >
                            Sign up
                        </button>
                    </form>
                    <a
                        href="/login"
                        className="text-white hover:text-secondary hover:underline mt-4 block text-center font-medium transition-colors duration-200"
                    >
                        Already have an account? Log in now
                    </a>
                </div>
            </main>
        </>
    )
}