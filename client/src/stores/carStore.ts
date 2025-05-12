import { create } from 'zustand';
import axios from 'axios';
const URL: string = 'http://localhost:8080/api/car/';
import useUserStore from './userStore';

type Car = {
    id: string;
    brand: string;
    model: string;
    yearOfProduction: number;
    engineType: string;
    kilometrage: number;
    isInsured: boolean;
}

type Store = {
    cars: Car[];
    fetchCars: () => Promise<void>;
    addCar: (newCar: Car) => Promise<void>;
    deleteCar: (carId: string) => Promise<void>;
}

const useCarStore = create<Store>((set) => ({
    cars: [],
    fetchCars: async () => {
        try {
            const response = await axios.get(`${URL}/${(useUserStore.getState().user as { id: string }).id}`, { withCredentials: true });
            set({ cars: response.data });
        } catch (error) {
            console.warn('error fetching cars');
        }
    },
    addCar: async (newCar) => {
        try {
            const response = await axios.post(`${URL}/add/${(useUserStore.getState().user as { id: string }).id}`, newCar, { withCredentials: true });
            set((state) => ({ cars: [...state.cars, response.data] }));
        } catch (error) {
            console.warn('error adding car');
        }
    },
    deleteCar: async (carId) => {
        try {
            await axios.delete(`${URL}/delete/${carId}`, { withCredentials: true });
            set((state) => ({ cars: state.cars.filter(car => car.id !== carId) }));
        } catch (error) {
            console.warn('error deleting car');
        }
    }
}))