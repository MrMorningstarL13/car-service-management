import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/service"

type Service = {
    name?: string,
    address?: string,
    city?: string,
    max_no_appointments?: number,
}

type BackendService = {
    id: number,
    name?: string,
    address?: string,
    city?: string,
    lat?: number,
    lng?: number,
    max_no_appointments?: number,
}

type Store = {
    services: any[],
    currentService: Service;
    fetchShops: (origin: any) => Promise<void>
    create: (newService: Service) => Promise<void>
    getById: (serviceId: number) => Promise<BackendService>
    update: (serviceId: number, updatedService: Service) => Promise<void>
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
            const response = await axios.get(`${URL}/getServiceById/${serviceId}`);
            set((state) => ({
                currentService: response.data
            }))
            return response.data as BackendService;
        } catch (error) {
            console.warn(error);
            throw new Error("Failed to fetch service by ID");
        }
    },
    update: async (serviceId: number, updatedService: Service) => {
        try {
            const response = await axios.patch(`${URL}/update/${serviceId}`, updatedService);
            set((state) => ({
                services: state.services.map((service: BackendService) =>
                    service.id === serviceId
                        ? response.data
                        : service
                ),
                currentService: response.data
            }));
        } catch (error) {
            console.warn("error updating service", error);
        }
    },

}))

export default useServiceStore