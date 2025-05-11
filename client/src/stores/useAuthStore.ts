import { create } from 'zustand'
import axios from 'axios'

type AuthState = {
    loggedIn: boolean | null
    checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    loggedIn: null,
    checkAuth: async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/auth/check', { withCredentials: true })
            set({ loggedIn: result.data.loggedIn })
        } catch {
            set({ loggedIn: false })
        }
    }
}))