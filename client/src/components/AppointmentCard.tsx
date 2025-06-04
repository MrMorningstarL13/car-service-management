import type React from "react"
import { Calendar, Clock, DollarSign, Car, CheckCircle, XCircle, AlertCircle, Hourglass } from "lucide-react"

export interface Appointment {
  id: number
  scheduledDate: string
  status: "waiting" | "accepted" | "in progress" | "denied" | "cancelled" | "finished"
  serviceId: number
  checkIn: string | null
  checkOut: string | null
  estimatedDuration: number | null
  estimatedCost: number
}

export interface CarWithAppointments {
  id: number
  brand: string
  model: string
  yearOfProduction: string
  appointments: Appointment[]
}

interface AppointmentCardProps {
  appointment: Appointment
  car: CarWithAppointments
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, car }) => {
  const getStatusInfo = (status: string) => {
    const statusMap = {
      waiting: {
        color: "rgba(189, 198, 103, 1)",
        bgColor: "rgba(189, 198, 103, 0.1)",
        icon: <Clock size={16} />,
        text: "Waiting",
      },
      accepted: {
        color: "rgba(119, 150, 109, 1)",
        bgColor: "rgba(119, 150, 109, 0.1)",
        icon: <CheckCircle size={16} />,
        text: "Accepted",
      },
      "in progress": {
        color: "rgba(98, 109, 88, 1)",
        bgColor: "rgba(98, 109, 88, 0.1)",
        icon: <Hourglass size={16} />,
        text: "In Progress",
      },
      denied: {
        color: "rgba(86, 40, 45, 1)",
        bgColor: "rgba(86, 40, 45, 0.1)",
        icon: <XCircle size={16} />,
        text: "Denied",
      },
      cancelled: {
        color: "rgba(86, 40, 45, 0.8)",
        bgColor: "rgba(86, 40, 45, 0.1)",
        icon: <XCircle size={16} />,
        text: "Cancelled",
      },
      finished: {
        color: "rgba(119, 150, 109, 1)",
        bgColor: "rgba(119, 150, 109, 0.1)",
        icon: <CheckCircle size={16} />,
        text: "Finished",
      },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.waiting
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const statusInfo = getStatusInfo(appointment.status)
  const { date, time } = formatDate(appointment.scheduledDate)

  return (
    <div className="bg-white rounded-lg shadow-md border border-[rgba(189,198,103,0.3)] p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Car size={20} className="text-[rgba(119,150,109,1)] mr-2" />
          <div>
            <h3 className="text-lg font-semibold text-[rgba(84,67,67,1)]">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-[rgba(84,67,67,0.7)]">{car.yearOfProduction}</p>
          </div>
        </div>

        <div
          className="flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color,
          }}
        >
          {statusInfo.icon}
          <span className="ml-1">{statusInfo.text}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <Calendar size={18} className="text-[rgba(119,150,109,1)] mr-3" />
          <div>
            <p className="text-sm font-medium text-[rgba(84,67,67,1)]">{date}</p>
            <p className="text-xs text-[rgba(84,67,67,0.7)]">{time}</p>
          </div>
        </div>

        <div className="flex items-center">
          <DollarSign size={18} className="text-[rgba(119,150,109,1)] mr-3" />
          <div>
            <p className="text-sm font-medium text-[rgba(84,67,67,1)]">${appointment.estimatedCost}</p>
            <p className="text-xs text-[rgba(84,67,67,0.7)]">Estimated Cost</p>
          </div>
        </div>

        {appointment.estimatedDuration && (
          <div className="flex items-center">
            <Clock size={18} className="text-[rgba(119,150,109,1)] mr-3" />
            <div>
              <p className="text-sm font-medium text-[rgba(84,67,67,1)]">{appointment.estimatedDuration} min</p>
              <p className="text-xs text-[rgba(84,67,67,0.7)]">Duration</p>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <AlertCircle size={18} className="text-[rgba(119,150,109,1)] mr-3" />
          <div>
            <p className="text-sm font-medium text-[rgba(84,67,67,1)]">Service #{appointment.serviceId}</p>
            <p className="text-xs text-[rgba(84,67,67,0.7)]">Service ID</p>
          </div>
        </div>
      </div>

      {(appointment.checkIn || appointment.checkOut) && (
        <div className="mt-4 pt-4 border-t border-[rgba(189,198,103,0.3)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointment.checkIn && (
              <div>
                <p className="text-xs text-[rgba(84,67,67,0.7)] mb-1">Check-in</p>
                <p className="text-sm font-medium text-[rgba(84,67,67,1)]">
                  {formatDate(appointment.checkIn).date} at {formatDate(appointment.checkIn).time}
                </p>
              </div>
            )}
            {appointment.checkOut && (
              <div>
                <p className="text-xs text-[rgba(84,67,67,0.7)] mb-1">Check-out</p>
                <p className="text-sm font-medium text-[rgba(84,67,67,1)]">
                  {formatDate(appointment.checkOut).date} at {formatDate(appointment.checkOut).time}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentCard
