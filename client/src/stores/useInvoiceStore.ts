import { create } from 'zustand';
import axios from 'axios';

interface Store {
    loading: boolean;
    error: string | null;
    sessionUrl: string | null;
    createCheckoutSession: (invoiceData: any) => Promise<void>;
}

const useInvoiceStore = create<Store>((set) => ({
    loading: false,
    error: null,
    sessionUrl: null,

    createCheckoutSession: async (invoiceData) => {
        set({ loading: true, error: null, sessionUrl: null });
        try {
            const response = await axios.post('http://localhost:8080/api/payment/create-checkout-session', invoiceData, {
                withCredentials: true,
            });

            const data = await response.data;
            set({ sessionUrl: data.url || null, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Unknown error', loading: false });
        }
    },
}));

export default useInvoiceStore