import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/favourite"

type Store = {
    favourites: any[],
    add: (userId: string, serviceId: string) => Promise<any>;
    remove: (userId: string, serviceId: string) => Promise<any>;
    getByUser: (userId: string) => Promise<any>
}

const useFavouriteStore = create<Store>((set) => ({
    favourites: [],
    add: async (userId, serviceId) => {
        try {
            console.log(typeof(serviceId))
            const response = await axios.post(`${URL}/add/${userId}/${serviceId}`)
            set((state) => ({favourites: [...state.favourites, response.data]}))
        } catch (error) {
            console.warn(error)
        }
    },
    remove: async (userId, serviceId) => {
        try {
            await axios.delete(`${URL}/remove/${userId}/${serviceId}`)
            set((state) => ({
                favourites: state.favourites.filter((fav) => fav.serviceId !== Number(serviceId))
            }))
        } catch (error) {
            console.warn(error)
        }
    },
    getByUser: async (userId) => {
        try {
            const response = await axios.get(`${URL}/getByUser/${userId}`)
            if( response != null){
                set((state) => ({favourites: response.data}))
            } else {
                set((state) => ({favourites: []}))
            }
        } catch (error) {
            console.warn(error)
        }
    }
}))

export default useFavouriteStore