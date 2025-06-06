import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/service"

type Store = {
    services: any[],
    fetchShops: (origin: any) => Promise<void>
}

const useServiceStore = create<Store>((set) => ({
    services: [],
    fetchShops: async (origin) => {
        try {
            await axios.post(`${URL}/getAllShops`, { origin })
                .then((response) => {
                    set({ services: response.data })
                })
                .catch((error) => {
                    console.warn(error)
                })

        } catch (error) {
            console.warn("error fetching services")
        }
    }
}))

export default useServiceStore