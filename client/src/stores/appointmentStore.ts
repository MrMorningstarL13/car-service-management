import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/appointment"

type Store = {
    appointments: any[],
    create: (carId: string, serviceId: number, appointmentData: any) => Promise<void>,
    getByUser: (userId: any) => Promise<void>
}

const useAppointmentStore = create<Store>((set) => ({
    appointments: [],
    create: async (carId, serviceId, appointmentData) => {
        try {
            const response = await axios.post(`${URL}/create/${carId}/${serviceId}`, appointmentData)
            if(response != null) {
                console.log("Appointment created successfully:", response.data);
            } else 
                console.warn("No response data received when creating appointment");
            // set((state) => ({ appointments: [...state.appointments, response.data] }));
        } catch (error) {
            console.warn('error creating appointment')
        }
    },
    getByUser: async (userId) => {
        try {
            const response = await axios.get(`${URL}/getByUser/${userId}`)
            if(response != null){
                set((state) => ({ appointments: response.data}))
            }
        } catch (error) {
            console.warn( "error in appointment store, getByUser" )
        }
    }
}))

export default useAppointmentStore;