import useUserStore from "../stores/userStore";
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";

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
        serviceId: null,
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const entity = authUserData.role === "customer" ? { user: userData } : { employee: employeeData }

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
        <main className="min-h-screen bg-[#f8f9f4] flex items-center justify-center">
            <div className="bg-primary rounded-xl p-4">
                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col">
                        <label className="text-black">First name</label>
                        <input type="text" name="firstName" value={authUserData.firstName} onChange={handleAuthUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                        <label className="text-black">Last name</label>
                        <input type="text" name="lastName" value={authUserData.lastName} onChange={handleAuthUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                        <label className="text-black">Email</label>
                        <input type="text" name="email" value={authUserData.email} onChange={handleAuthUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                        <label className="text-black">Password</label>
                        <input type="password" name="password" value={authUserData.password} onChange={handleAuthUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                        <label className="text-black">Please select your role</label>
                        <select name="role" className="text-contrast-primary my-2 w-full rounded-md border border-secondary focus:border-tertiary" value={authUserData.role} onChange={handleAuthUserChange}>
                            <option value={"customer"}>Customer</option>
                            <option value={"employee"}>Service Rep</option>
                        </select>


                        {authUserData.role === "customer" && (
                            <>
                                <label className="text-black">Date of birth</label>
                                <input type="date" name="dateOfBirth" value={userData.dateOfBirth.toISOString().split("T")[0]} onChange={handleUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                                <label className="text-black">Phone number</label>
                                <input type="text" name="phone" value={userData.phone} onChange={handleUserChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                            </>
                        )}

                        {authUserData.role === "employee" && (
                            <>
                                <label className="text-black">Hire date</label>
                                <input type="date" name="dateOfBirth" value={employeeData.hireDate.toISOString().split("T")[0]} onChange={handleEmployeeChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                                <label className="text-black">Position occupied</label>
                                <input type="text" name="position" value={employeeData.position} onChange={handleEmployeeChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                                <label className="text-black">Experience level</label>
                                <input type="text" name="experienceLevel" value={employeeData.experienceLevel} onChange={handleEmployeeChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
                                <label className="text-black">Current salary</label>
                                <input type="number" name="salary" value={employeeData.salary} onChange={handleEmployeeChange} className="w-full py-2 px-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none" />
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
                    className="text-contrast-primary hover:text-contrast-secondary hover:underline mt-4 block text-center font-medium transition-colors duration-200"
                >
                    Already have an account? Log in now
                </a>
            </div>
        </main>
    )
}