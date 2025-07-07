import { create } from 'zustand'
import axios from "axios"

type Store = {
    serviceTypes: any[]
    getByShop: (serviceId: number) => Promise<void>,
    getName: (serviceTypeId: any) => Promise<string>
}

const useServiceTypeStore = create<Store>((set) => ({
    serviceTypes: [],
    getByShop: async(serviceId) => {

    },
    getName: async(serviceTypeId) => {
        const response = await axios.get(`http://localhost:8080/api/serviceType/getName/${serviceTypeId}`)
        return response.data
    }
}))

export default useServiceTypeStore