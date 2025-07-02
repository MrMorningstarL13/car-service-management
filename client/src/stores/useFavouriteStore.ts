import { create } from 'zustand'
import axios from "axios"

const URL: string = "http://localhost:8080/api/favourite"

type Store = {
    favourites: any[],
    add: (userId: string, serviceId: string) => Promise<any>;
    remove: (userId: string, serviceId: string) => Promise<any>;
    getByUser: (userId: string) => Promise<any>
}

const useFavouriteStore = create<Store>((set, get) => ({
    favourites: [],
    add: async (userId, serviceId) => {
        try {
            const response = await axios.post(`${URL}/add/${userId}/${serviceId}`)

            const newFavourite = response.data?.[0]
            const currentFavourites = get().favourites
            const exists = currentFavourites.some(fav => Number(fav.serviceId) === Number(serviceId))

            if (!exists && newFavourite) {
                set(state => ({
                    favourites: [...state.favourites, newFavourite]
                }))
            }

            return newFavourite
        } catch (error) {
            console.warn('Error adding favourite:', error)
            throw error
        }
    },
    remove: async (userId, serviceId) => {
        try {
            await axios.delete(`${URL}/remove/${userId}/${serviceId}`)

            set((state) => {
                const newFavourites = state.favourites.filter((fav) => Number(fav.serviceId) !== Number(serviceId));
                console.log('New favourites after remove:', newFavourites);
                return { favourites: newFavourites };
            })
        } catch (error) {
            console.warn('Error removing favourite:', error)
            throw error; // Re-throw to handle in component
        }
    },

    getByUser: async (userId) => {
        try {
            const response = await axios.get(`${URL}/getByUser/${userId}`)

            if (response && response.data) {
                set(() => ({ favourites: response.data }))
            } else {
                set(() => ({ favourites: [] }))
            }

            return response.data;
        } catch (error) {
            console.warn(error)
            set(() => ({ favourites: [] }))
            throw error;
        }
    }
}))

export default useFavouriteStore