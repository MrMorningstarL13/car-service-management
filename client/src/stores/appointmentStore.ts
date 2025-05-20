import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/appointment"

type appointment = {
    id: string,

}

type Store = {
    appointments: any[],
    create: (carId: string, serviceId: number, appointmentData: any) => Promise<void>
}

const useAppointmentStore = create<Store>((set) => ({
    appointments: [],
    create: async (carId, serviceId, appointmentData) => {
        try {
            const response = await axios.post(`${URL}/create/${carId}/${serviceId}`, appointmentData)
            set((state) => ({ appointments: [...state.appointments, response.data] }));
        } catch (error) {
            console.warn('error creating appointment')
        }
    }
}))

export default useAppointmentStore;