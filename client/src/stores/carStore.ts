import { create } from 'zustand';
import axios from 'axios';
const URL: string = 'http://localhost:8080/api/car';
import useUserStore from './userStore';

type BaseCar = {
    brand: string;
    model: string;
    yearOfProduction: string;
    engineType: string;
    kilometrage: string;
    isInsured: boolean;
}

type BackendCar = BaseCar & { id: number }

type Store = {
    cars: BackendCar[];
    fetchCars: () => Promise<void>;
    addCar: (newCar: BaseCar) => Promise<void>;
    deleteCar: (carId: number) => Promise<void>;
    getImage: (brand: string, model: string, yearOfProduction: string) => Promise<any>;
}

const useCarStore = create<Store>((set) => ({
    cars: [],
    fetchCars: async () => {
        try {
            const response = await axios.get(`${URL}/getByUser/${(useUserStore.getState().user as { id: string }).id}`, { withCredentials: true });
            set({ cars: response.data });
        } catch (error) {
            console.warn(error);
        }
    },
    addCar: async (newCar) => {
        try {
            const response = await axios.post(`${URL}/create/${(useUserStore.getState().user as { id: string }).id}`, newCar, { withCredentials: true });
            set((state) => ({ cars: [...state.cars, response.data] }));
        } catch (error) {
            console.warn('error adding car');
        }
    },
    deleteCar: async (carId) => {
        try {
            await axios.delete(`${URL}/delete/${carId}`, { withCredentials: true });
            set((state) => ({ cars: state.cars.filter(car => (car).id !== Number(carId)) }));
        } catch (error) {
            console.warn('error deleting car');
        }
    },
    getImage: async (brand, model, yearOfProduction) => {
        try {
            const response = await axios.get(`${URL}/search?brand=${brand}&model=${model}&yearOfProduction=${yearOfProduction}`, { withCredentials: true });
            return response;
        } catch (error) {
            console.warn(error);
        }
    }
}))

export default useCarStore;