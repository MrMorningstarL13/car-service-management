import ShopCard from "../components/ShopCard"
import Navbar from "../components/Navbar"
import useServiceStore from "../stores/serviceStore"
import userStore from "../stores/userStore"
import useCarStore from "../stores/carStore"
import { useEffect, useState } from 'react'
import RepAppointmentCard from "../components/RepAppointmentCard"
import { Calendar } from "../components/ui/Calendar"

export default function Home() {

    const [answeredPrompt, setAnsweredPrompt] = useState(false)

    const { services, fetchShops } = useServiceStore()
    const { fetchCars } = useCarStore()

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
    }, [fetchShops, fetchCars])

    const serviceCoordinates = services.map((service) => {
        id: service.id;
        lat: service.lat;
        lng: service.lng;
    })

    const getUserLocation = (): Promise<{ lat: number, lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation not supported")
            } else {
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    (err) => reject(err.message)
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
        <main className="min-h-screen bg-[#f8f9f4]">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-contrast-primary mb-6">Auto Shops Near You</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} />
                    ))}
                </div>
            </div>
        </main>
    )
}
