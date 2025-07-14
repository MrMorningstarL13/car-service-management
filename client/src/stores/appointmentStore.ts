import { create } from 'zustand'
import axios from "axios"

const URL: string = "http://localhost:8080/api/appointment"

type Store = {
    userAppointments: any[],
    serviceAppointments: any[],
    create: (carId: string, serviceId: number, appointmentData: any) => Promise<number | void>,
    getByUser: (userId: any) => Promise<void>,
    update: (appointmentId: string, appointmentData: any) => Promise<void>,
    getByService: (serviceId: any) => Promise<void>,
}

const useAppointmentStore = create<Store>((set) => ({
    userAppointments: [],
    serviceAppointments: [],

    create: async (carId, serviceId, appointmentData) => {
        try {
            const response = await axios.post(`${URL}/create/${carId}/${serviceId}`, appointmentData)
            if (response != null) {
                console.log("Appointment created successfully")
                return response.data.id
            } else {
                console.warn("No response data received when creating appointment")
            }
        } catch (error) {
            console.warn('Error creating appointment:', error)
        }
    },

    getByUser: async (userId) => {
        try {
            const response = await axios.get(`${URL}/getByUser/${userId}`)
            if (response != null) {
                set(() => ({ userAppointments: response.data }))
            }
        } catch (error) {
            console.warn("Error fetching appointments by user:", error)
        }
    },

    update: async (appointmentId, appointmentData) => {
        try {
            const response = await axios.patch(`${URL}/update/${appointmentId}`, appointmentData)
            const updatedAppointment = response.data

            set((state) => ({
                userAppointments: state.userAppointments.map((appointment: any) =>
                    appointment.id === updatedAppointment.id
                        ? { ...appointment, ...updatedAppointment }
                        : appointment
                ),
            }))
        } catch (error) {
            console.warn('Error updating appointment:', error)
        }
    },

    getByService: async (serviceId) => {
        try {
            const response = await axios.get(`${URL}/getByService/${serviceId}`)
            if (response != null) {
                set(() => ({ serviceAppointments: response.data }))
            }
        } catch (error) {
            console.warn("Error fetching appointments by service:", error)
        }
    }
}))

export default useAppointmentStore
