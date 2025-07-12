import { create } from 'zustand';
import axios from 'axios';
import { persist, createJSONStorage } from 'zustand/middleware';

const URL: string = 'http://localhost:8080/api/repair'

type Store = {
    repairs: any[];
    createRepair: (appointmentId: number, serviceTypeId: number) => Promise<void>;
    assignRepair: (employeeId: number, repairId: number) => Promise<void>;
    completeRepair: (repairId: number) => Promise<void>;
    getByEmployee: (employeeId: number) => Promise<any>;
}

const repairStore = create<Store>()(
    persist(
        (set, get) => ({
            repairs: [],
            createRepair: async (appointmentId: number, serviceTypeId: number) => {
                const response = await axios.post(`${URL}/create/${appointmentId}/${serviceTypeId}`);
                set((state) => ({
                    repairs: [...state.repairs, response.data]
                }));
            },
            assignRepair: async (repairId: number, employeeId: number) => {
                await axios.patch(`${URL}/assign/${repairId}/${employeeId}`)
                set((state) => ({
                    repairs: state.repairs.map(repair =>
                        repair.id === repairId ? { ...repair, employeeId } : repair
                    )
                }));
            },
            completeRepair: async (repairId: number) => {
                const response = await axios.post(`${URL}/complete/${repairId}`);
                set((state) => ({
                    repairs: state.repairs.map(repair =>
                        repair.id === repairId ? { ...repair, ...response.data } : repair
                    )
                }));
            },
            getByEmployee: async( employeeId: number) => {
                const response = await axios.get(`${URL}/getByEmployee/${employeeId}`)
                set((state) => ({
                    repairs: response.data
                }))
            }
        }),
        {
            name: 'repair-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default repairStore;