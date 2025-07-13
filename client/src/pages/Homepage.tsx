import ShopCard from "../components/ShopCard"
import Navbar from "../components/Navbar"
import useServiceStore from "../stores/serviceStore"
import userStore from "../stores/userStore"
import useCarStore from "../stores/carStore"
import { useEffect, useState } from "react"
import RepAppointmentCard from "../components/RepAppointmentCard"
import { Calendar } from "../components/ui/Calendar"
import toast, { Toaster } from "react-hot-toast"
import useFavouriteStore from "../stores/useFavouriteStore"
import { Heart, Grid3X3, ChevronDown } from "lucide-react"
import useAppointmentStore from "../stores/appointmentStore"
import useEmployeeStore from "../stores/useEmployeeStore"
import EmployeeDashboard from "../components/EmployeeDashboard"
import repairStore from "../stores/repairStore"

export default function Home() {
    const [answeredPrompt, setAnsweredPrompt] = useState(false)
    const [viewMode, setViewMode] = useState<"all" | "favourites">("all")
    const [isCompletedExpanded, setIsCompletedExpanded] = useState(false)

    const { services, fetchShops } = useServiceStore()
    const { fetchCars } = useCarStore()
    const { favourites, getByUser } = useFavouriteStore()
    const { serviceAppointments, getByService, update } = useAppointmentStore()
    const { employees, fetchEmployees } = useEmployeeStore()
    const { assignRepair } = repairStore()

    const currentUser: any = userStore.getState().user

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userLocation = await getUserLocation()
                fetchShops(userLocation)
            } catch (error) {
                console.warn(error)
                fetchShops(undefined)
            } finally {
                setAnsweredPrompt(true)
            }
            fetchCars()
        }

        fetchData()
        getByUser(currentUser.id)

        if (currentUser.employee != null) {
            const serviceId = currentUser.employee.serviceId
            getByService(serviceId)
            fetchEmployees(serviceId)
        }

    }, [fetchShops, fetchCars, getByUser, getByService, fetchEmployees])

    const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation not supported")
            } else {
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    (err) => reject(err.message),
                )
            }
        })
    }

    const handleAssignEmployee = (repairId: number, employeeId: number) => {
        console.log(`Assigning employee ${employeeId} to repair ${repairId}`)
        assignRepair(repairId, employeeId)
    }

    const handleUpdateAppointmentStatus = (appointmentId: number, status: string) => {
        console.log(`Updating appointment ${appointmentId} status to ${status}`)
        const updateBody = {
            status: status
        }
        update(String(appointmentId), updateBody)
    }

    const filteredServices =
        viewMode === "all" ? services : services.filter(service => favourites.some(f => f.serviceId === service.id))

        
        // @ts-ignore
        if (userStore.getState().user.role === "employee" && userStore.getState().user.employee.isRep) {
        const activeAppointments = serviceAppointments.filter(
            (appointment) => !["finished", "cancelled", "denied"].includes(appointment.status)
        )
    
        const completedAppointments = serviceAppointments.filter((appointment) =>
            ["finished", "cancelled", "denied"].includes(appointment.status)
        )
        return (
            <main className="min-h-full bg-[#f8f9f4]">
                <Navbar role="rep" />
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-contrast-primary mb-2">Service Representative Dashboard</h1>
                        <p className="text-gray-600">Manage appointments and assign repairs to employees</p>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)]">
                                Active Appointments ({activeAppointments.length})
                            </h2>
                            {activeAppointments.length > 0 && (
                                <div className="flex items-center space-x-2 text-sm text-[rgba(84,67,67,0.6)]">
                                    <div className="w-3 h-3 bg-[rgba(119,150,109,1)] rounded-full"></div>
                                    <span>Requires attention</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {activeAppointments.map((appointment) => (
                                <RepAppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    employees={employees}
                                    onAssignEmployee={handleAssignEmployee}
                                    onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                                />
                            ))}
                        </div>

                        {activeAppointments.length === 0 && (
                            <div className="bg-white rounded-lg shadow-md p-8 border border-[rgba(189,198,103,0.3)] text-center">
                                <div className="text-[rgba(189,198,103,0.4)] mb-4">
                                    <Calendar className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-[rgba(84,67,67,1)] mb-2">No active appointments</h3>
                                <p className="text-[rgba(84,67,67,0.6)]">New appointments will appear here when they are scheduled.</p>
                            </div>
                        )}
                    </div>

                    {completedAppointments.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md border border-[rgba(189,198,103,0.3)] overflow-hidden">
                            <button
                                onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
                                className="w-full px-6 py-4 bg-[rgba(189,198,103,0.05)] hover:bg-[rgba(189,198,103,0.1)] transition-colors duration-200 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-[rgba(84,67,67,0.4)] rounded-full"></div>
                                        <h2 className="text-xl font-bold text-[rgba(84,67,67,1)]">
                                            Completed Appointments ({completedAppointments.length})
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-[rgba(84,67,67,0.6)]">
                                        {isCompletedExpanded ? "Hide" : "Show"} completed
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-[rgba(84,67,67,0.6)] transition-transform duration-200 ${isCompletedExpanded ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </button>

                            {isCompletedExpanded && (
                                <div className="p-6 border-t border-[rgba(189,198,103,0.2)]">
                                    <div className="space-y-6">
                                        {completedAppointments.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="opacity-75 hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <RepAppointmentCard
                                                    appointment={appointment}
                                                    employees={employees}
                                                    onAssignEmployee={handleAssignEmployee}
                                                    onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        )
    }

    if (userStore.getState().user.role === "employee") {
        return (
            <main className="min-h-screen bg-[#f8f9f4]">
                <Navbar role="emp" />
                <EmployeeDashboard />
            </main>
        )
    }

    if (!answeredPrompt) {
        return (
            <main className="min-h-screen bg-[#f8f9f4]">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen bg-[#f8f9f4]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-contrast-primary mb-4">Finding Auto Shops...</h1>
                        <p className="text-secondary">Please allow location access to find shops near you.</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <>
            <div>
                <Toaster />
            </div>
            <main className="min-h-screen bg-[#f8f9f4]">
                <Navbar />

                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-3xl font-bold text-[rgba(84,67,67,1)] mb-4 sm:mb-0">Auto Shops Near You</h1>

                        <div className="flex bg-white rounded-lg shadow-sm border border-[rgba(189,198,103,0.3)] p-1">
                            <button
                                onClick={() => setViewMode("all")}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === "all"
                                        ? "bg-[rgba(119,150,109,1)] text-black shadow-sm"
                                        : "text-[rgba(84,67,67,0.7)] hover:text-[rgba(84,67,67,1)] hover:bg-[rgba(189,198,103,0.1)]"
                                    }`}
                            >
                                <Grid3X3 size={16} className="mr-2" />
                                View All
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white bg-opacity-20">{services.length}</span>
                            </button>
                            <button
                                onClick={() => setViewMode("favourites")}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === "favourites"
                                        ? "bg-[rgba(119,150,109,1)] text-black shadow-sm"
                                        : "text-[rgba(84,67,67,0.7)] hover:text-[rgba(84,67,67,1)] hover:bg-[rgba(189,198,103,0.1)]"
                                    }`}
                            >
                                <Heart size={16} className="mr-2" />
                                View Favourites
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white bg-opacity-20">
                                    {favourites.length}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-[rgba(84,67,67,0.7)] text-sm">
                            {viewMode === "all"
                                ? `Showing ${filteredServices.length} auto shops near you`
                                : `Showing ${filteredServices.length} of your favourite shops`}
                        </p>
                    </div>

                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((shop) => (
                                <ShopCard key={shop.id} shop={shop} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-[rgba(84,67,67,0.4)] mb-4">
                                {viewMode === "favourites" ? (
                                    <Heart className="w-16 h-16 mx-auto" />
                                ) : (
                                    <Grid3X3 className="w-16 h-16 mx-auto" />
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-[rgba(84,67,67,1)] mb-2">
                                {viewMode === "favourites" ? "No favourite shops yet" : "No shops found"}
                            </h3>
                            <p className="text-[rgba(84,67,67,0.6)]">
                                {viewMode === "favourites"
                                    ? "Start adding shops to your favourites to see them here."
                                    : "Try adjusting your location or check back later."}
                            </p>
                            {viewMode === "favourites" && (
                                <button
                                    onClick={() => setViewMode("all")}
                                    className="mt-4 px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200"
                                >
                                    Browse All Shops
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}