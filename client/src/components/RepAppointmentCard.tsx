import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Calendar, Euro, Car, AlertTriangle, CheckCircle, Play, X, Star } from "lucide-react"
import RepairCard from "./RepairCard"

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

interface Appointment {
    id: number
    scheduledDate: string
    estimatedDuration: number | null
    estimatedCost: number
    checkIn: string | null
    checkOut: string | null
    status: string
    priority: string
    createdAt: string
    updatedAt: string
    carId: number
    invoiceId: number | null
    serviceId: number
    repairs: Repair[]
}

interface AppointmentCardProps {
    appointment: Appointment
    employees: Employee[]
    onAssignEmployee: (repairId: number, employeeId: number) => void
    onUpdateAppointmentStatus: (appointmentId: number, status: string) => void
}

export default function RepAppointmentCard({
    appointment,
    employees,
    onAssignEmployee,
    onUpdateAppointmentStatus,
}: AppointmentCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "waiting":
                return "bg-yellow-100 text-yellow-800"
            case "in progress":
                return "bg-blue-100 text-blue-800"
            case "completed":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "premium":
                return "bg-purple-100 text-purple-800"
            case "normal":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleStatusUpdate = (status: string) => {
        onUpdateAppointmentStatus(appointment.id, status)
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">Appointment #{appointment.id}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(appointment.priority)}`}>
                            {appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)} Priority
                        </span>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-primary hover:text-primary/80 font-medium text-sm"
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(appointment.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Euro className="w-4 h-4" />
                        <span>Est. Cost: ${appointment.estimatedCost}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Car className="w-4 h-4" />
                        <span>Car ID: {appointment.carId}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleStatusUpdate("in progress")}
                        disabled={appointment.status === "waiting_payment"}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play className="w-4 h-4" />
                        <span>In Progress</span>
                    </button>

                    <button
                        onClick={() => handleStatusUpdate("waiting_payment")}
                        disabled={appointment.status === "waiting_payment"}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark as Awaiting Payment</span>
                    </button>
                </div>
            </div>

            {/* Repairs Section */}
            {isExpanded && (
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <h4 className="font-medium text-gray-900">Repairs ({appointment.repairs.length})</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {appointment.repairs.map((repair) => (
                            <RepairCard key={repair.id} repair={repair} employees={employees} onAssignEmployee={onAssignEmployee} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
