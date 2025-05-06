import { create } from 'zustand';
import axios from 'axios';
const URL: string = 'http://localhost:8080/api/user';

type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: Date;
    isAdmin: boolean;
}

type LogInUser = {
    email: string;
    password: string;
}

type Store = {
    user: object;
    createUser: (newUser: User) => Promise<void>;
    logIn: (user: LogInUser) => Promise<void>;
};

const useUserStore = create<Store>((set) => ({
    user: {},
    createUser: async (newUser) => {
        try {

            const response = await axios.post(`${URL}/signUp`, newUser)
            set({ user: response.data })

        } catch (error) {
            console.warn('error creating user');
        }

    },
    logIn: async (user) => {
        try {
            const response = await axios.post(`${URL}/logIn`, user)
            set({ user: response.data })
        } catch (error) {
            console.warn('error logging in user');
        }
    },
}))

export default useUserStore;