import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/service"

type Store = {
    services: any[],
    fetchShops: () => Promise<void>
    getDistances: () => Promise<any>
}

const useServiceStore = create<Store>((set) => ({
    services: [],
    fetchShops: async () => {
        try {
            await axios.get(`${URL}/getAllShops`)
                .then((response) => {
                    set({ services: response.data })
                })
                .catch((error) => {
                    console.warn(error)
                })

        } catch (error) {
            console.warn("error fetching services")
        }
    },
    getDistances: async () => {
        try {
            const response = await axios.get(`${URL}/getDistances`);
            return response.data as any;
        } catch (error) {
            console.warn(error);
            return [];
        }
    }
}))

export default useServiceStore