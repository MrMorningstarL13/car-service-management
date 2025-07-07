import { create } from 'zustand'
import axios from "axios"

type Store = {
    serviceTypes: any[]
    getByShop: (serviceId: number) => Promise<any>,
    getName: (serviceTypeId: any) => Promise<string>
    create: (newServiceType: any, serviceId: any) => void
    update: (serviceTypeId: any, updatedServiceType: any) => Promise<any>
    deleteServiceType: (serviceTypeId: any) => Promise<void>
}

const useServiceTypeStore = create<Store>((set) => ({
    serviceTypes: [],
    getByShop: async (serviceId) => {
        const response = await axios.get(`http://localhost:8080/api/serviceType/getByShop/${serviceId}`)
        set((state) => ({ serviceTypes: [response.data] }))
    },
    getName: async (serviceTypeId) => {
        const response = await axios.get(`http://localhost:8080/api/serviceType/getName/${serviceTypeId}`)
        return response.data
    },
    create: async (serviceId, newServiceType) => {
        const response = await axios.post(`http://localhost:8080/api/serviceType/create/${serviceId}`, newServiceType, { withCredentials: true })
        set((state) => ({ serviceTypes: [...state.serviceTypes, response.data] }))
    },
    update: async (serviceTypeId, updatedServiceType) => {
        const response = await axios.patch(`http://localhost:8080/api/serviceType/update/${serviceTypeId}`, updatedServiceType, { withCredentials: true })
        return response.data
    },
    deleteServiceType: async (serviceTypeId: any) => {
        await axios.delete(`http://localhost:8080/api/serviceType/delete/${serviceTypeId}`, { withCredentials: true });
        set((state) => ({
            serviceTypes: state.serviceTypes.filter(st => st.id !== serviceTypeId)
        }));
    },
}))

export default useServiceTypeStore