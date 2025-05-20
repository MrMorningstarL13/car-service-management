import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/service/getAllShops"

type Store = {
    services: any[],
    fetchShops: () => Promise<void>
}

const useServiceStore = create<Store>((set) => ({
    services: [],
    fetchShops: async () => {
        try {
            await axios.get(URL)
            .then( (response) => {
                set({ services: response.data })
            })
            .catch( (error) => {
                console.warn(error)
            })

        } catch (error) {
            console.warn("error fetching services")
        }
    }
}))

export default useServiceStore