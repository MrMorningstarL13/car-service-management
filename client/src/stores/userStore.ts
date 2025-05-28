import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import axios from "axios"
import { useAuthStore } from "./useAuthStore"

const URL: string = "http://localhost:8080/api/user"

type User = {
  phone: string
  dateOfBirth: Date
}

type AuthUser = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

type Employee = {
  hireDate: Date
  position: string
  experienceLevel: string
  salary: number
  isRep: boolean
}

type Entity = {
  user?: User
  employee?: Employee
}

type LogInUser = {
  email: string
  password: string
}

type Store = {
  user: object
  createUser: (newAuthUser: AuthUser, entity: Entity) => Promise<void>
  logIn: (user: LogInUser) => Promise<void>
  logOut: () => Promise<void>
  initializeUser: () => Promise<void>
}

const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      user: {},
      createUser: async ( newAuthUser, entity ) => {
        const entityData = entity.user || entity.employee
        try {
          const response = await axios.post(`${URL}/signUp`, { ...newAuthUser, ...entityData }, {
            withCredentials: true,
          })

          set({ user: response.data })

          await useAuthStore.getState().checkAuth()
        } catch (error) {
          console.warn("error creating user")
        }
      },

      logIn: async (user) => {
        try {
          const response = await axios.post(`${URL}/logIn`, user, {
            withCredentials: true,
          })

          set({ user: response.data })

          await useAuthStore.getState().checkAuth()
        } catch (error) {
          console.warn("error logging in user")
        }
      },

      logOut: async () => {
        try {
          await axios.post(
            `${URL}/logOut`,
            {},
            {
              withCredentials: true,
            },
          )
          set({ user: {} })
          useAuthStore.getState().loggedIn = false
        } catch (error) {
          console.warn("error logging out user")
        }
      },

      initializeUser: async () => {
        try {
          const response = await axios.get(`${URL}/me`, {
            withCredentials: true,
          })

          if (response.data.loggedIn) {
            set({ user: response.data.user })
            useAuthStore.getState().loggedIn = true
          } else {
            set({ user: {} })
            useAuthStore.getState().loggedIn= false
          }
        } catch (error) {
          console.warn("Session expired or invalid")
          set({ user: {} })
          useAuthStore.getState().loggedIn = false
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

export default useUserStore
