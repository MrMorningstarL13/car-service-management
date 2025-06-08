import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/service"

type Service = {
    name?: string,
    address?: string,
    city?: string,
}

type BackendService = {
    name?: string,
    address?: string,
    city?: string,
    lat?: number,
    lng?: number,
}

type Store = {
    services: any[],
    currentService: Service;
    fetchShops: (origin: any) => Promise<void>
    create: (newService: Service) => Promise<void>
    getById: (serviceId: number) => Promise<BackendService>
}

const useServiceStore = create<Store>((set) => ({
    services: [],
    currentService: {},
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
    },
    create: async (newService) => {
        try {
            await axios.post(`${URL}/create`, newService)
                .then((response) => {
                    set({ currentService: response.data })
                })
        } catch (error) {
            console.warn(error)
        }
    },
    getById: async (serviceId) => {
        try {
            const response = await axios.get(`${URL}/getById/${serviceId}`);
            return response.data as BackendService;
        } catch (error) {
            console.warn(error);
            throw new Error("Failed to fetch service by ID");
        }
    }

}))

export default useServiceStore