import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/appointment"

type Store = {
    userAppointments: any[],
    serviceAppointments: any[],
    create: (carId: string, serviceId: number, appointmentData: any) => Promise<number>,
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
                console.log("Appointment created successfully");
            } else
                console.warn("No response data received when creating appointment");
            return response.data.id;
        } catch (error) {
            console.warn('error creating appointment')
        }
    },
    getByUser: async (userId) => {
        try {
            const response = await axios.get(`${URL}/getByUser/${userId}`)
            if (response != null) {
                set((state) => ({ userAppointments: response.data }))
            }
        } catch (error) {
            console.warn("error in appointment store, getByUser")
        }
    },
    update: async (appointmentId, appointmentData) => {
        try {
            const response = await axios.patch(`${URL}/update/${appointmentId}`, appointmentData)
            const updatedAppointment = response.data

            set((state) => ({
                userAppointments: state.userAppointments.map((appointment: any) =>
                    appointment.id === updatedAppointment.id ? updatedAppointment : appointment
                ),
            }))
        } catch (error) {
            console.warn('error updating appointment', error)
        }
    },
    getByService: async(serviceId) => {
        try {
            const response = await axios.get(`${URL}/getByService/${serviceId}`)
            
            if(response != null) {
                set((state) => ({ serviceAppointments: response.data}))
            }
        } catch (error) {
            console.warn("error getting appointments by service", error)
        }
    }
}))

export default useAppointmentStore;