import { create } from 'zustand';
import axios from 'axios';
const URL: string = 'http://localhost:8080/api/user/signUp';

type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: Date;
    isAdmin: boolean;
}

type Store = {
    user: object;
    createUser: (newUser: User) => Promise<void>;
};

const useUserStore = create<Store>((set) => ({
    user: {},
    createUser: async (newUser) => {
        try {

            const response = await axios.post(URL, newUser)
            set({ user: response.data })

        } catch (error) {
            console.warn('error creating user');
        }

    }
}))

export default useUserStore;