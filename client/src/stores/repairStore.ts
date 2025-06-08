import { create } from 'zustand';
import axios from 'axios';
import { persist, createJSONStorage } from 'zustand/middleware';

const URL: string = 'http://localhost:8080/api/repair'

type Store = {
    repairs: any[];
    createRepair: (appointmentId: number, serviceTypeId: number) => Promise<void>;
    assignRepair: (employeeId: number, repairId: number) => Promise<void>;
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
            assignRepair: async (employeeId: number, repairId: number) => {
                await axios.put(`${URL}/${repairId}/assign`, { employeeId });
                set((state) => ({
                    repairs: state.repairs.map(repair =>
                        repair.id === repairId ? { ...repair, employeeId } : repair
                    )
                }));
            }
        }),
        {
            name: 'repair-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default repairStore;