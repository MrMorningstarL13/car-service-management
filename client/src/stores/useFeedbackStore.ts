import { create } from 'zustand'
import axios from "axios"
const URL: string = "http://localhost:8080/api/feedback"

type Store = {
    feedbacks: any [],
    create: (userId: any, serviceId: any, data: any) => Promise<any>
    delete: (feedbackId: any) => Promise<any>
    update: (feedbackId: any, data: any) => Promise<any>
    getAll: (serviceId: any) => Promise<any>
    getAverage: (serviceId: any) => Promise<number>
    reset: () => void
}

const useFeedbackStore = create<Store>((set) => ({
    feedbacks: [],
    create: async (userId, serviceId, data) => {
        const response = await axios.post(`${URL}/create/${userId}/${serviceId}`, { ...data });
        return response.data;
    },
    delete: async (feedbackId) => {
        const response = await axios.delete(`${URL}/delete/${feedbackId}`);
        return response.data;
    },
    update: async (feedbackId, data) => {
        const response = await axios.patch(`${URL}/update/${feedbackId}`, {data});
        return response.data;
    },
    getAll: async (serviceId) => {
        const response = await axios.get(`${URL}/getAll/${serviceId}`);
        set({ feedbacks: response.data });
        return response.data;
    },
    getAverage: async (serviceId) => {
        const response = await axios.get(`${URL}/getAverageRating/${serviceId}`);
        return response.data;
    },
    reset: () => {
        set({ feedbacks: []})
    }
}))

export default useFeedbackStore;