import type React from "react"
import { Calendar, Clock, Car, CheckCircle, XCircle, AlertCircle, Hourglass, Euro, CreditCard } from "lucide-react"
import useServiceStore from "../stores/serviceStore"
import useAppointmentStore from "../stores/appointmentStore"
import useInvoiceStore from "../stores/useInvoiceStore"
import { toast } from 'react-hot-toast'
import axios from "axios"

export interface Appointment {
    id: any
    scheduledDate: string
    status: "waiting" | "in progress" | "cancelled" | "finished" | "waiting_payment"
    serviceId: number
    checkIn: string | null
    checkOut: string | null
    estimatedDuration: number | null
    estimatedCost: number
    invoiceId: any
}

export interface CarWithAppointments {
    id: any
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
        update(appointment.id, { status: "cancelled" })
        toast.success("Appointment cancelled with success")
    }

    const { createCheckoutSession, sessionUrl } = useInvoiceStore()

    const handleProceedToPayment = async () => {
        await createCheckoutSession({ appointmentId: appointment.id, appointment: appointment })
        if (sessionUrl) {
            window.location.href = sessionUrl
        } else {
            console.error("Stripe session URL not available.")
        }
    }

    const handleInvoiceDownload = async () => {
        try {
            const invoiceId = appointment.invoiceId;
            const response = await axios.get(`http://localhost:8080/api/payment/downloadInvoice/${invoiceId}`, {
                responseType: 'blob',
            });

            if (response.headers['content-type'] !== 'application/pdf') {
                throw new Error("Expected PDF content but got: " + response.headers['content-type']);
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${car.model}-${appointment.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Invoice downloaded successfully.");
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Invoice download failed.");
        }
    };


    const getStatusInfo = (status: string) => {
        const statusMap = {
            waiting: {
                color: "rgba(189, 198, 103, 1)",
                bgColor: "rgba(189, 198, 103, 0.1)",
                icon: <Clock size={16} />,
                text: "Waiting",
            },
            "in progress": {
                color: "rgba(98, 109, 88, 1)",
                bgColor: "rgba(98, 109, 88, 0.1)",
                icon: <Hourglass size={16} />,
                text: "In Progress",
            },
            waiting_payment: {
                color: "rgba(86, 40, 45, 1)",
                bgColor: "rgba(86, 40, 45, 0.1)",
                icon: <CreditCard size={16} />,
                text: "Payment Required",
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
    const isPaymentRequired = appointment.status === "waiting_payment"

    return (
        <div
            className={`bg-white rounded-xl shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 overflow-hidden ${isPaymentRequired ? "ring-2 ring-[rgba(86,40,45,0.3)] shadow-[rgba(86,40,45,0.1)]" : ""
                }`}
            style={{ borderLeftColor: statusInfo.color }}
        >
            <div
                className={`${isPaymentRequired
                    ? "bg-gradient-to-r from-[rgba(86,40,45,0.1)] to-[rgba(86,40,45,0.05)]"
                    : "bg-gradient-to-r from-[rgba(189,198,103,0.05)] to-[rgba(119,150,109,0.05)]"
                    } p-4`}
            >
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
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold ${isPaymentRequired ? "animate-pulse" : ""
                            }`}
                        style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
                    >
                        {statusInfo.icon}
                        <span>{statusInfo.text}</span>
                    </div>
                </div>

                {isPaymentRequired && (
                    <div className="mt-3 p-2 bg-[rgba(86,40,45,0.1)] border border-[rgba(86,40,45,0.2)] rounded-lg">
                        <div className="flex items-center text-[rgba(86,40,45,1)]">
                            <AlertCircle size={16} className="mr-2" />
                            <span className="text-sm font-medium">Payment required to complete this appointment</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center p-3 bg-[rgba(189,198,103,0.05)] rounded-lg">
                        <div className="p-2 bg-white rounded-full shadow-sm mr-3">
                            <Calendar size={16} className="text-[rgba(119,150,109,1)]" />
                        </div>
                        <div>
                            <p className="font-medium text-[rgba(84,67,67,1)]">{date}</p>
                            <p className="text-sm text-[rgba(84,67,67,0.7)]">{time}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-[rgba(189,198,103,0.05)] rounded-lg">
                        <div className="p-2 bg-white rounded-full shadow-sm mr-3">
                            <Euro size={16} className="text-[rgba(119,150,109,1)]" />
                        </div>
                        <div>
                            <p className="font-medium text-[rgba(84,67,67,1)]">€{appointment.estimatedCost}</p>
                            <p className="text-sm text-[rgba(84,67,67,0.7)]">{isPaymentRequired ? "Amount Due" : "Estimated Cost"}</p>
                        </div>
                    </div>

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

                <div className="mt-6 flex justify-end space-x-3">
                    {isPaymentRequired && (
                        <button
                            className="px-6 py-3 text-sm font-bold rounded-lg bg-[rgba(86,40,45,1)] text-white hover:bg-[rgba(86,40,45,0.9)] transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                            onClick={handleProceedToPayment}
                        >
                            <CreditCard size={18} className="mr-2" />
                            Proceed to Payment
                        </button>
                    )}

                    {(appointment.status === "waiting") && (
                        <button
                            className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-[rgba(86,40,45,1)] text-[rgba(86,40,45,1)] hover:bg-[rgba(86,40,45,1)] hover:text-white transition-all duration-200 transform hover:scale-105"
                            onClick={handleCancel}
                        >
                            Cancel Appointment
                        </button>
                    )}

                    {appointment.status === "finished" && (
                        <button
                            className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-[rgba(119,150,109,1)] text-[rgba(119,150,109,1)] hover:bg-[rgba(119,150,109,1)] hover:text-white transition-all duration-200 transform hover:scale-105"
                            onClick={handleInvoiceDownload}
                        >
                            Download Invoice
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}

export default AppointmentCard
