"use client"

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
import { Heart, Grid3X3 } from "lucide-react"

export default function Home() {
    const [answeredPrompt, setAnsweredPrompt] = useState(false)
    const [viewMode, setViewMode] = useState<"all" | "favourites">("all")

    const { services, fetchShops } = useServiceStore()
    const { fetchCars } = useCarStore()
    const { favourites, getByUser } = useFavouriteStore()

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

        const currentUser: any = userStore.getState().user
        fetchData()
        getByUser(currentUser.id)

    }, [fetchShops, fetchCars, getByUser])

    const serviceCoordinates = services.map((service) => ({
        id: service.id,
        lat: service.lat,
        lng: service.lng,
    }))

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
        // Here you would make an API call to assign the employee
    }

    const handleUpdateAppointmentStatus = (appointmentId: number, status: string) => {
        console.log(`Updating appointment ${appointmentId} status to ${status}`)
        // Here you would make an API call to update the appointment status
    }

    const handleUpdateAppointmentPriority = (appointmentId: number, priority: string) => {
        console.log(`Updating appointment ${appointmentId} priority to ${priority}`)
        // Here you would make an API call to update the appointment priority
    }

    // Filter services based on view mode
    const filteredServices =
        viewMode === "all" ? services : services.filter(service => favourites.some(f => f.serviceId === service.id))

    console.log('services', services)
    console.log('favourites', favourites)

    const mockAppointments = [
        {
            id: 27,
            scheduledDate: "2025-06-25T09:00:00.000Z",
            estimatedDuration: null,
            estimatedCost: 150,
            checkIn: null,
            checkOut: null,
            status: "waiting",
            priority: "normal",
            createdAt: "2025-06-10T11:14:17.000Z",
            updatedAt: "2025-06-10T11:14:17.000Z",
            carId: 2,
            invoiceId: null,
            serviceId: 13,
            repairs: [
                {
                    id: 9,
                    isComplete: false,
                    createdAt: "2025-06-10T11:14:17.000Z",
                    updatedAt: "2025-06-10T11:14:17.000Z",
                    appointmentId: 27,
                    employeeId: null,
                    serviceTypeId: 1,
                },
            ],
        },
        {
            id: 28,
            scheduledDate: "2025-06-18T08:30:00.000Z",
            estimatedDuration: null,
            estimatedCost: 235,
            checkIn: null,
            checkOut: null,
            status: "waiting",
            priority: "normal",
            createdAt: "2025-06-10T11:15:00.000Z",
            updatedAt: "2025-06-10T11:15:00.000Z",
            carId: 2,
            invoiceId: null,
            serviceId: 13,
            repairs: [
                {
                    id: 10,
                    isComplete: false,
                    createdAt: "2025-06-10T11:15:00.000Z",
                    updatedAt: "2025-06-10T11:15:00.000Z",
                    appointmentId: 28,
                    employeeId: null,
                    serviceTypeId: 2,
                },
                {
                    id: 11,
                    isComplete: false,
                    createdAt: "2025-06-10T11:15:00.000Z",
                    updatedAt: "2025-06-10T11:15:00.000Z",
                    appointmentId: 28,
                    employeeId: null,
                    serviceTypeId: 1,
                },
            ],
        },
    ]

    const mockEmployees = [
        {
            id: 1,
            firstName: "John",
            lastName: "Smith",
            position: "Senior Mechanic",
            experienceLevel: "Expert",
        },
        {
            id: 2,
            firstName: "Sarah",
            lastName: "Johnson",
            position: "Technician",
            experienceLevel: "Intermediate",
        },
        {
            id: 3,
            firstName: "Mike",
            lastName: "Davis",
            position: "Junior Mechanic",
            experienceLevel: "Beginner",
        },
    ]

    // @ts-ignore
    if (userStore.getState().user.role === "employee" && userStore.getState().user.employee.isRep) {
        return (
            <main className="min-h-full bg-[#f8f9f4]">
                <Navbar role="rep" />
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-contrast-primary mb-2">Service Representative Dashboard</h1>
                        <p className="text-gray-600">Manage appointments and assign repairs to employees</p>
                    </div>

                    <div className="space-y-6">
                        {mockAppointments.map((appointment) => (
                            <RepAppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                employees={mockEmployees}
                                onAssignEmployee={handleAssignEmployee}
                                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                                onUpdateAppointmentPriority={handleUpdateAppointmentPriority}
                            />
                        ))}
                    </div>

                    {mockAppointments.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Calendar className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
                            <p className="text-gray-600">New appointments will appear here when they are scheduled.</p>
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
                <div className="flex items-center justify-center min-h-screen bg-[#f8f9f4]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-contrast-primary mb-4">Employee Interface</h1>
                        <p className="text-secondary">Please wait while the employee interface is loading.</p>
                    </div>
                </div>
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
