import { create } from "zustand"
import axios from "axios"
import { persist, createJSONStorage } from "zustand/middleware"

const URL: string = "http://localhost:8080/api/employee"

type Employee = {
    id: number
    firstName: string
    lastName: string
    email: string
    hireDate: Date
    auth_user: any
    position: string
    experienceLevel: string
    salary: number
    isRep: boolean
}

type Store = {
    employees: Employee[]
    fetchEmployees: (serviceId: number) => Promise<void>
    addEmployee: (newEmployee: any, serviceId: number) => Promise<any>
    deleteEmployee: (employeeId: number) => Promise<void>
    updateEmployee: (employeeId: number, updatedData: any) => Promise<void>
}

const useEmployeeStore = create<Store>()(
    persist(
        (set) => ({
            employees: [],
            fetchEmployees: async (serviceId: number) => {
                try {
                    const response = await axios.get(`${URL}/getAllByShop/${serviceId}`, {
                        withCredentials: true,
                    });
                    set({ employees: response.data });
                } catch (error) {
                    console.warn("Error fetching employees:", error);
                }
            },
            addEmployee: async (newEmployee: any, serviceId: number) => {
                try {
                    const response: any = await axios.post(`${URL}/create/${serviceId}`, newEmployee, {
                        withCredentials: true,
                    });

                    const resultEmployee = {
                        ...response.data.employeeResult,
                        auth_user: response.data.authResult
                    }
                    set((state) => ({
                        employees: [...state.employees, resultEmployee],
                    }));

                    return response.data;
                } catch (error) {
                    console.warn("Error adding employee:", error);
                }
            },
            deleteEmployee: async (employeeId) => {
                try {
                    await axios.delete(`${URL}/delete/${employeeId}`, { withCredentials: true });
                    set((state) => ({ employees: state.employees.filter(emp => emp.id !== employeeId) }));
                } catch (error) {
                    console.warn("Error deleting employee:", error);
                }
            },
            updateEmployee: async (employeeId, updatedData) => {
                try {
                    const response = await axios.put(`${URL}/update/${employeeId}`, updatedData, { withCredentials: true });
                    set((state) => ({
                        employees: state.employees.map(emp =>
                            emp.id === employeeId ? response.data : emp
                        )
                    }));
                } catch (error) {
                    console.warn("Error updating employee:", error);
                }
            }
        }),
        {
            name: "employee-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useEmployeeStore;