"use client"

import type React from "react"
import { Calendar, Clock, Car, CheckCircle, XCircle, AlertCircle, Hourglass, Euro } from "lucide-react"
import useServiceStore from "../stores/serviceStore"
import useAppointmentStore from "../stores/appointmentStore"

// Define interfaces
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
  const { services } = useServiceStore()
  const { update } = useAppointmentStore()

  const handleCancel = () => {
    update(appointment.id.toString(), { status: "cancelled" })
  }

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
    <div
      className="bg-white rounded-xl shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 overflow-hidden"
      style={{ borderLeftColor: statusInfo.color }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[rgba(189,198,103,0.05)] to-[rgba(119,150,109,0.05)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-white shadow-sm">
              <Car size={20} className="text-[rgba(119,150,109,1)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[rgba(84,67,67,1)]">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-[rgba(84,67,67,0.6)]">Year: {car.yearOfProduction}</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
          >
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Service Name - Prominent Display */}
        <div className="mb-4 p-3 bg-[rgba(119,150,109,0.05)] rounded-lg border border-[rgba(119,150,109,0.1)]">
          <div className="flex items-center">
            <AlertCircle size={18} className="text-[rgba(119,150,109,1)] mr-2" />
            <div>
              <p className="font-semibold text-[rgba(84,67,67,1)]">
                {services.filter((el) => el.id === appointment.serviceId).map((el) => el.name)}
              </p>
              <p className="text-xs text-[rgba(84,67,67,0.6)]">Service Type</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Date & Time */}
          <div className="flex items-center p-3 bg-[rgba(189,198,103,0.05)] rounded-lg">
            <div className="p-2 bg-white rounded-full shadow-sm mr-3">
              <Calendar size={16} className="text-[rgba(119,150,109,1)]" />
            </div>
            <div>
              <p className="font-medium text-[rgba(84,67,67,1)]">{date}</p>
              <p className="text-sm text-[rgba(84,67,67,0.7)]">{time}</p>
            </div>
          </div>

          {/* Cost */}
          <div className="flex items-center p-3 bg-[rgba(189,198,103,0.05)] rounded-lg">
            <div className="p-2 bg-white rounded-full shadow-sm mr-3">
              <Euro size={16} className="text-[rgba(119,150,109,1)]" />
            </div>
            <div>
              <p className="font-medium text-[rgba(84,67,67,1)]">€{appointment.estimatedCost}</p>
              <p className="text-sm text-[rgba(84,67,67,0.7)]">Estimated Cost</p>
            </div>
          </div>

          {/* Duration */}
          {appointment.estimatedDuration && (
            <div className="flex items-center p-3 bg-[rgba(189,198,103,0.05)] rounded-lg">
              <div className="p-2 bg-white rounded-full shadow-sm mr-3">
                <Clock size={16} className="text-[rgba(119,150,109,1)]" />
              </div>
              <div>
                <p className="font-medium text-[rgba(84,67,67,1)]">{appointment.estimatedDuration} min</p>
                <p className="text-sm text-[rgba(84,67,67,0.7)]">Duration</p>
              </div>
            </div>
          )}
        </div>

        {/* Check-in/Check-out Section */}
        {(appointment.checkIn || appointment.checkOut) && (
          <div className="mt-4 p-4 bg-[rgba(98,109,88,0.05)] rounded-lg border border-[rgba(98,109,88,0.1)]">
            <h4 className="font-medium text-[rgba(84,67,67,1)] mb-3 text-sm">Service Timeline</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {appointment.checkIn && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[rgba(119,150,109,1)] rounded-full mr-3"></div>
                  <div>
                    <p className="text-xs font-medium text-[rgba(84,67,67,0.7)]">Check-in</p>
                    <p className="text-sm font-medium text-[rgba(84,67,67,1)]">
                      {formatDate(appointment.checkIn).date} at {formatDate(appointment.checkIn).time}
                    </p>
                  </div>
                </div>
              )}
              {appointment.checkOut && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[rgba(98,109,88,1)] rounded-full mr-3"></div>
                  <div>
                    <p className="text-xs font-medium text-[rgba(84,67,67,0.7)]">Check-out</p>
                    <p className="text-sm font-medium text-[rgba(84,67,67,1)]">
                      {formatDate(appointment.checkOut).date} at {formatDate(appointment.checkOut).time}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(appointment.status === "waiting" || appointment.status === "accepted") && (
          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-[rgba(86,40,45,1)] text-[rgba(86,40,45,1)] hover:bg-[rgba(86,40,45,1)] hover:text-white transition-all duration-200 transform hover:scale-105"
              onClick={handleCancel}
            >
              Cancel Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard
