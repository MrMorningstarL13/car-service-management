import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, User, Clock } from "lucide-react"
import useServiceTypeStore from "../stores/useServiceTypeStore"

interface Employee {
    id: number
    firstName: string
    lastName: string
    position: string
    experienceLevel: string
    auth_user: any
}

interface Repair {
    id: number
    isComplete: boolean
    createdAt: string
    updatedAt: string
    appointmentId: number
    employeeId: number | null
    serviceTypeId: number
}

interface RepairCardProps {
    repair: Repair
    employees: Employee[]
    onAssignEmployee: (repairId: number, employeeId: number) => void
}

export default function RepairCard({ repair, employees, onAssignEmployee }: RepairCardProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        employees.find((emp) => emp.id === repair.employeeId) || null,
    )
    const [name, setName] = useState("")
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { getName } = useServiceTypeStore()
    console.log(repair)

    useEffect(() => {
        const fetchName = async () => {
            try {
                const result = await getName(repair.serviceTypeId)
                setName(result)
            } catch (error) {
                console.warn(error)
            }
        }
        fetchName()
    }, [repair])

    // Create portal element on mount
    useEffect(() => {
        setPortalElement(document.body)

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleAssignEmployee = (employee: Employee) => {
        setSelectedEmployee(employee)
        onAssignEmployee(repair.id, employee.id)
        setIsDropdownOpen(false)
    }

    const getDropdownPosition = () => {
        if (!buttonRef.current) return { top: 0, left: 0, width: 0 }

        const rect = buttonRef.current.getBoundingClientRect()
        return {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
        }
    }

    const { top, left, width } = getDropdownPosition()

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${repair.isComplete ? "bg-green-500" : "bg-yellow-500"}`} />
                    <h4 className="font-medium text-gray-900">{name}</h4>
                </div>
                <span
                    className={`px-2 py-1 text-xs rounded-full ${repair.isComplete ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {repair.isComplete ? "Complete" : "Pending"}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Created: {new Date(repair.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Employee</label>
                    <button
                        ref={buttonRef}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">
                                {selectedEmployee ? `${selectedEmployee.auth_user.firstName} ${selectedEmployee.auth_user.lastName}` : "Select employee"}
                            </span>
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {isDropdownOpen &&
                        portalElement &&
                        createPortal(
                            <div
                                ref={dropdownRef}
                                style={{
                                    position: "absolute",
                                    top: `${top}px`,
                                    left: `${left}px`,
                                    width: `${width}px`,
                                    zIndex: 50,
                                }}
                                className="mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                            >
                                {employees.map((employee) => (
                                    <button
                                        key={employee.id}
                                        onClick={() => handleAssignEmployee(employee)}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {employee.auth_user.firstName} {employee.auth_user.lastName}
                                            </span>
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                <span>{employee.position}</span>
                                                <span>•</span>
                                                <span>{employee.experienceLevel}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>,
                            portalElement,
                        )}
                </div>

                {selectedEmployee && (
                    <div className="bg-gray-50 rounded-md p-2">
                        <div className="text-xs text-gray-600">
                            <span className="font-medium">Assigned to:</span> {selectedEmployee.firstName} {selectedEmployee.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                            {selectedEmployee.position} • {selectedEmployee.experienceLevel}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
