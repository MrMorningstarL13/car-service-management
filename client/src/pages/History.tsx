import { useState, useMemo, useEffect } from "react"
import Navbar from "../components/Navbar"
import AppointmentCard, { type CarWithAppointments, type Appointment } from "../components/AppointmentCard"
import { Filter, Car } from "lucide-react"
import useAppointmentStore from "../stores/appointmentStore"
import useUserStore from "../stores/userStore"
import useCarStore from "../stores/carStore"

export default function History() {
    const { fetchCars } = useCarStore()
    const { appointments, getByUser } = useAppointmentStore()
    const currentUser: any = useUserStore.getState().user;
    const currentUserId = currentUser.user.createdEntity.id;

    useEffect(() => {
        fetchCars()
        getByUser(currentUserId)
    }, [])
    
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null)
    const carsData = appointments;

    const allAppointments = useMemo(() => {
        return carsData.flatMap((car) =>
            car.appointments.map((appointment: any) => ({
                appointment,
                car,
            })),
        )
    }, [carsData])

    const filteredAppointments = useMemo(() => {
        if (selectedCarId === null) return allAppointments
        return allAppointments.filter(({ car }) => car.id === selectedCarId)
    }, [allAppointments, selectedCarId])

    const { activeAppointments, pastAppointments } = useMemo(() => {
        const active: Array<{ appointment: Appointment; car: CarWithAppointments }> = []
        const past: Array<{ appointment: Appointment; car: CarWithAppointments }> = []

        filteredAppointments.forEach((item) => {
            const { appointment } = item
            if (["waiting", "accepted", "in progress"].includes(appointment.status)) {
                active.push(item)
            } else if (["denied", "cancelled", "finished"].includes(appointment.status)) {
                past.push(item)
            }
        })

        active.sort(
            (a, b) => new Date(a.appointment.scheduledDate).getTime() - new Date(b.appointment.scheduledDate).getTime(),
        )
        past.sort(
            (a, b) => new Date(b.appointment.scheduledDate).getTime() - new Date(a.appointment.scheduledDate).getTime(),
        )

        return { activeAppointments: active, pastAppointments: past }
    }, [filteredAppointments])

    return (
        <main className="min-h-screen bg-[#f8f9f4]">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[rgba(84,67,67,1)] mb-6">Appointments</h1>

                <div className="bg-white rounded-lg shadow-md p-6 border border-[rgba(189,198,103,0.3)] mb-8">
                    <div className="flex items-center mb-4 justify-center">
                        <Filter size={20} className="text-[rgba(119,150,109,1)] mr-2" />
                        <h2 className="text-lg font-semibold text-[rgba(84,67,67,1)]">Filter by Car</h2>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setSelectedCarId(null)}
                            className={`px-4 py-2 rounded-md border transition-colors duration-200 ${selectedCarId === null
                                ? "bg-[rgba(119,150,109,1)] text-white border-[rgba(119,150,109,1)]"
                                : "bg-white text-[rgba(84,67,67,1)] border-[rgba(189,198,103,1)] hover:bg-[rgba(189,198,103,0.1)]"
                                }`}
                        >
                            All Cars
                        </button>

                        {carsData.map((car) => (
                            <button
                                key={car.id}
                                onClick={() => setSelectedCarId(car.id)}
                                className={`px-4 py-2 rounded-md border transition-colors duration-200 flex items-center ${selectedCarId === car.id
                                    ? "bg-[rgba(119,150,109,1)] text-white border-[rgba(119,150,109,1)]"
                                    : "bg-white text-[rgba(84,67,67,1)] border-[rgba(189,198,103,1)] hover:bg-[rgba(189,198,103,0.1)]"
                                    }`}
                            >
                                <Car size={16} className="mr-2" />
                                {car.yearOfProduction} {car.brand} {car.model}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)] mb-4">
                        Active Appointments ({activeAppointments.length})
                    </h2>

                    {activeAppointments.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 border border-[rgba(189,198,103,0.3)] text-center">
                            <p className="text-[rgba(84,67,67,0.7)]">No active appointments found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {activeAppointments.map(({ appointment, car }) => (
                                <AppointmentCard key={`${car.id}-${appointment.id}`} appointment={appointment} car={car} />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)] mb-4">
                        Past Appointments ({pastAppointments.length})
                    </h2>

                    {pastAppointments.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 border border-[rgba(189,198,103,0.3)] text-center">
                            <p className="text-[rgba(84,67,67,0.7)]">No past appointments found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {pastAppointments.map(({ appointment, car }) => (
                                <AppointmentCard key={`${car.id}-${appointment.id}`} appointment={appointment} car={car} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
