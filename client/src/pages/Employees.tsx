import { useState, useEffect } from "react"
import EmployeeTable from "../components/EmployeeTable"
import AddEmployeeDialog from "../components/AddEmployeeDialog"
import PasswordDisplayDialog from "../components/PasswordDialog"
import DeleteConfirmDialog from "../components/DeleteEmployeeDialog"
import { Plus, FileText, RefreshCw } from "lucide-react"
import Navbar from "../components/Navbar"
import useEmployeeStore from "../stores/useEmployeeStore"
import useUserStore from "../stores/userStore"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast"
export interface Employee {
    id: number
    firstName: string
    auth_user: any
    lastName: string
    email: string
    hireDate: string
    position: string
    experienceLevel: string
    salary: number
}

interface AddEmployeeResult {
    password?: string
    authResult?: { email?: string }
    [key: string]: any
}

export default function EmployeesPage() {
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [generatedPassword, setGeneratedPassword] = useState("")
    const [generatedEmail, setGeneratedEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { currentServiceId } = useUserStore()
    const { employees, fetchEmployees, addEmployee, deleteEmployee, updateEmployee } = useEmployeeStore()

    const exportToExcel = () => {
        const flatEmployees = employees.map(emp => ({
            ID: emp.id,
            FirstName: emp.auth_user?.firstName || "",
            LastName: emp.auth_user?.lastName || "",
            Email: emp.auth_user?.email || "",
            Role: emp.auth_user?.role || "",
            Position: emp.position,
            ExperienceLevel: emp.experienceLevel,
            Salary: emp.salary,
            HireDate: emp.hireDate,
            IsRepresentative: emp.isRep ? "Yes" : "No",
        }));

        const worksheet = XLSX.utils.json_to_sheet(flatEmployees);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "employees.xlsx");
    };


    useEffect(() => {
        fetchEmployees(currentServiceId)
    }, [fetchEmployees, currentServiceId])

    const handleEmployeeSubmit = async (employeeData: any) => {
        setIsLoading(true)
        try {
            if (editingEmployee) {
                const updatedEmployeeData = { ...editingEmployee, ...employeeData }
                await updateEmployee(editingEmployee.id, updatedEmployeeData)
                setIsEmployeeDialogOpen(false)
                setEditingEmployee(null)
            } else {
                const result = await addEmployee(employeeData, currentServiceId) as AddEmployeeResult | undefined
                if (result) {
                    setGeneratedPassword(result.password ?? "default")
                    setGeneratedEmail(result.authResult?.email || "default")
                    setIsPasswordDialogOpen(true)
                }

                setIsEmployeeDialogOpen(false)
            }
        } catch (error) {
            console.error("Error saving employee:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteEmployee = async (id: number) => {
        setIsLoading(true)
        try {
            await deleteEmployee(id)
            setIsDeleteDialogOpen(false)
        } catch (error) {
            console.error("Error deleting employee:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = async () => {
        setIsLoading(true)
        try {
            await fetchEmployees(currentServiceId)
        } catch (error) {
            console.error("Error refreshing employees:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const openAddDialog = () => {
        setEditingEmployee(null)
        setIsEmployeeDialogOpen(true)
    }

    const openEditDialog = (employee: Employee) => {
        setEditingEmployee(employee)
        setIsEmployeeDialogOpen(true)
    }

    const openDeleteDialog = (employee: Employee) => {
        setSelectedEmployee(employee)
        setIsDeleteDialogOpen(true)
    }

    const closeEmployeeDialog = () => {
        setIsEmployeeDialogOpen(false)
        setEditingEmployee(null)
    }

    const handleExport = () => {
        toast.success("File has been exported succesfully")
        exportToExcel()
    }

    return (
        <main className="bg-[#f8f9f4] min-h-screen">
            <Navbar role="rep" />
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[rgba(84,67,67,1)]">Employee Management</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={openAddDialog}
                            className="flex items-center px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200"
                        >
                            <Plus size={18} className="mr-2" />
                            Add Employee
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center px-3 py-2 bg-white border border-[rgba(119,150,109,1)] text-[rgba(119,150,109,1)] hover:bg-[rgba(119,150,109,0.1)] rounded-md transition-colors duration-200"
                        >
                            <RefreshCw size={18} className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                        <button onClick={handleExport} className="flex items-center px-3 py-2 bg-white border border-[rgba(119,150,109,1)] text-[rgba(119,150,109,1)] hover:bg-[rgba(119,150,109,0.1)] rounded-md transition-colors duration-200">
                            <FileText size={18} className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>

                <EmployeeTable
                    employees={employees.map(emp => ({
                        ...emp.auth_user,
                        ...emp,
                        hireDate: emp.hireDate,
                    }))}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    isLoading={isLoading}
                />

                {isEmployeeDialogOpen && (
                    <AddEmployeeDialog
                        isOpen={isEmployeeDialogOpen}
                        onClose={closeEmployeeDialog}
                        onSubmit={handleEmployeeSubmit}
                        isLoading={isLoading}
                        employee={editingEmployee ?? undefined}
                    />
                )}

                {isDeleteDialogOpen && selectedEmployee && (
                    <DeleteConfirmDialog
                        isOpen={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        onConfirm={() => handleDeleteEmployee(selectedEmployee.id)}
                        employee={selectedEmployee}
                        isLoading={isLoading}
                    />
                )}

                {isPasswordDialogOpen && (
                    <PasswordDisplayDialog
                        isOpen={isPasswordDialogOpen}
                        onClose={() => setIsPasswordDialogOpen(false)}
                        password={generatedPassword}
                        email={generatedEmail}
                    />
                )}
            </div>
        </main>
    )
}