import { create } from 'zustand'
import axios from "axios"
const URL: string = "localhost:8080/api/service/getAllShops"

type Store = {
    services: any[],
    fetchShops: () => {}
}

const useServiceStore = create<Store>() ((set) => ({
    services: [],
    fetchShops: async () => {
        try {
            const response = await axios.get(URL)
            set({ services: response.data })
        } catch (error) {
            console.warn("error fetching services")
        }
    }
}))