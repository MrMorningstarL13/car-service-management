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
  const currentUser: any = useUserStore.getState().user
  const currentUserId = currentUser.id

  useEffect(() => {
    fetchCars()
    getByUser(currentUserId)
  }, [])

  const [selectedCarId, setSelectedCarId] = useState<number | null>(null)
  const carsData = appointments

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

  const { activeAppointments, pastAppointments, paymentAppointments } = useMemo(() => {
    const active: Array<{ appointment: Appointment; car: CarWithAppointments }> = []
    const past: Array<{ appointment: Appointment; car: CarWithAppointments }> = []
    const payment: Array<{ appointment: Appointment; car: CarWithAppointments }> = []

    filteredAppointments.forEach((item) => {
      const { appointment } = item
      if (appointment.status === "waiting_payment") {
        payment.push(item)
      } else if (["waiting", "accepted", "in progress"].includes(appointment.status)) {
        active.push(item)
      } else if (["denied", "cancelled", "finished"].includes(appointment.status)) {
        past.push(item)
      }
    })

    // Sort payment appointments by date (most urgent first)
    payment.sort(
      (a, b) => new Date(a.appointment.scheduledDate).getTime() - new Date(b.appointment.scheduledDate).getTime(),
    )

    active.sort(
      (a, b) => new Date(a.appointment.scheduledDate).getTime() - new Date(b.appointment.scheduledDate).getTime(),
    )
    past.sort(
      (a, b) => new Date(b.appointment.scheduledDate).getTime() - new Date(a.appointment.scheduledDate).getTime(),
    )

    return { activeAppointments: active, pastAppointments: past, paymentAppointments: payment }
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
              className={`px-4 py-2 rounded-md border transition-colors duration-200 ${
                selectedCarId === null
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
                className={`px-4 py-2 rounded-md border transition-colors duration-200 flex items-center ${
                  selectedCarId === car.id
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

        {/* Payment Required Section */}
        {paymentAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[rgba(86,40,45,1)] mb-4 flex items-center">
              <span className="bg-[rgba(86,40,45,1)] text-white px-3 py-1 rounded-full text-sm mr-3">URGENT</span>
              Payment Required ({paymentAppointments.length})
            </h2>
            <div className="bg-gradient-to-r from-[rgba(86,40,45,0.1)] to-[rgba(86,40,45,0.05)] rounded-lg p-4 border-2 border-[rgba(86,40,45,0.3)] mb-4">
              <p className="text-[rgba(86,40,45,1)] font-medium text-center">
                ⚠️ These appointments require payment to be completed. Please proceed with payment as soon as possible.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentAppointments.map(({ appointment, car }) => (
                <AppointmentCard key={`${car.id}-${appointment.id}`} appointment={appointment} car={car} />
              ))}
            </div>
          </div>
        )}

        {/* Active Appointments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)] mb-4">
            Active Appointments ({activeAppointments.length})
          </h2>

          {activeAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 border border-[rgba(189,198,103,0.3)] text-center">
              <p className="text-[rgba(84,67,67,0.7)]">No active appointments found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAppointments.map(({ appointment, car }) => (
                <AppointmentCard key={`${car.id}-${appointment.id}`} appointment={appointment} car={car} />
              ))}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        <div>
          <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)] mb-4">
            Past Appointments ({pastAppointments.length})
          </h2>

          {pastAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 border border-[rgba(189,198,103,0.3)] text-center">
              <p className="text-[rgba(84,67,67,0.7)]">No past appointments found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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
