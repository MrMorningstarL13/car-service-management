import { create } from 'zustand'
import axios from "axios"

type Store = {
    serviceTypes: any[]
    getByShop: (serviceId: number) => Promise<void>
}