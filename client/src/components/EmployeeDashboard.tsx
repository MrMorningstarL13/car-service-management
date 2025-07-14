import { useState, useEffect } from "react"
import { CheckCircle2, ChevronLeft, ChevronRight, Car, Wrench, Clock } from "lucide-react"
import repairStore from "../stores/repairStore"
import useUserStore from "../stores/userStore"
import toast from "react-hot-toast"

interface Repair {
    id: number
    isComplete: boolean
    createdAt: string
    updatedAt: string
    appointmentId: number
    employeeId: number
    serviceTypeId: number
    appointment: {
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
        car: {
            id: number
            brand: string
            model: string
            yearOfProduction: string
            engineType: string
            kilometrage: number
            isInsured: boolean
            plateNumber: string
            createdAt: string
            updatedAt: string
            userId: number
        }
    }
    service_type: {
        id: number
        name: string
        description: string
        baseCost: number
        createdAt: string
        updatedAt: string
        serviceId: number
    }
}

export default function EmployeeDashboard() {
    const [currentWeek, setCurrentWeek] = useState(new Date())
    const { repairs, getByEmployee, completeRepair } = repairStore()

    const currentUser: any = useUserStore.getState().user
    const employeeId = currentUser.employee.id

    useEffect(() => {
        getByEmployee(employeeId)
    }, [])

    const getWeekDates = (date: Date) => {
        const week = []
        const startOfWeek = new Date(date)
        const day = startOfWeek.getDay()
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
        startOfWeek.setDate(diff)

        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(startOfWeek)
            weekDate.setDate(startOfWeek.getDate() + i)
            week.push(weekDate)
        }
        return week
    }

    const getRepairsForDate = (date: Date) => {
        return repairs.filter((repair) => {
            const repairDate = new Date(repair?.appointment?.scheduledDate)
            return repairDate.toDateString() === date.toDateString()
        })
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    }

    const navigateWeek = (direction: "prev" | "next") => {
        setCurrentWeek((prev) => {
            const newDate = new Date(prev)
            newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
            return newDate
        })
    }

    const handleCompleteRepair = (repairId: number) => {
        completeRepair(repairId)
        toast.success("Completed task!")
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "normal":
                return "border-l-blue-500"
            case "premium":
                return "border-l-purple-500"
            default:
                return "border-l-blue-500"
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Weekly Schedule</h1>
                            <p className="text-slate-600 mt-1">
                                {getWeekDates(currentWeek)[0].toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                })}{" "}
                                -{" "}
                                {getWeekDates(currentWeek)[6].toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigateWeek("prev")}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => navigateWeek("next")}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-slate-200">
                        {getWeekDates(currentWeek).map((date, index) => {
                            const isToday = date.toDateString() === new Date().toDateString()
                            const dayRepairs = getRepairsForDate(date)

                            return (
                                <div key={index} className="p-4 text-center border-r border-slate-200 last:border-r-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-500">
                                            {date.toLocaleDateString("en-US", { weekday: "short" })}
                                        </p>
                                        <p className={`text-xl font-bold ${isToday ? "text-blue-600" : "text-slate-900"}`}>
                                            {date.getDate()}
                                        </p>
                                        <p className="text-xs text-slate-400">{dayRepairs.length} jobs</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-7">
                        {getWeekDates(currentWeek).map((date, index) => {
                            const dayRepairs = getRepairsForDate(date)
                            const isToday = date.toDateString() === new Date().toDateString()

                            return (
                                <div
                                    key={index}
                                    className={`min-h-auto p-3 border-r border-slate-200 last:border-r-0 ${isToday ? "bg-blue-50/30" : ""
                                        }`}
                                >
                                    <div className="space-y-3">
                                        {dayRepairs.map((repair) => (
                                            <div
                                                key={repair.id}
                                                className={`bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow ${getPriorityColor(
                                                    repair.appointment.priority,
                                                )} ${repair.isComplete ? "opacity-75" : ""}`}
                                            >
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <Clock size={14} className="text-slate-400" />
                                                            <span className="text-sm font-medium text-slate-900">
                                                                {formatTime(repair.appointment.scheduledDate)}
                                                            </span>
                                                        </div>
                                                        {repair.isComplete && (
                                                            <div className="flex items-center space-x-1">
                                                                <CheckCircle2 size={14} className="text-green-600" />
                                                                <span className="text-xs text-green-600 font-medium">Done</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mb-3">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <Wrench size={14} className="text-blue-600" />
                                                            <h4 className="font-semibold text-slate-900 text-sm">{repair.service_type.name}</h4>
                                                        </div>
                                                        <p className="text-xs text-slate-600 leading-relaxed">{repair.service_type.description}</p>
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Car size={14} className="text-slate-400" />
                                                            <span className="font-medium text-slate-900 text-sm">
                                                                {repair.appointment.car.brand} {repair.appointment.car.model}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                            <div>
                                                                <span className="font-medium">Year:</span> {repair.appointment.car.yearOfProduction}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Engine:</span> {repair.appointment.car.engineType}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Plate:</span> {repair.appointment.car.plateNumber}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Miles:</span>{" "}
                                                                {repair.appointment.car.kilometrage.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {!repair.isComplete && (
                                                        <button
                                                            onClick={() => handleCompleteRepair(repair.id)}
                                                            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                            <span>Complete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}