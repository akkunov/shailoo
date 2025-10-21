import type {User} from "@/types/models.ts";
import {create} from "zustand";
import {api} from "@/api/axios.ts";
import type {AxiosError} from "axios";


interface CreateAgitatorInput {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    pin: string;
    coordinatorId: number;
    uiks: number[];
}
export interface AgitatorState {
    agitators: User[];
    loading: boolean;
    error: string | null;


    fetchAgitators: (url:string) => Promise<void>;
    createAgitator: (input: Partial<CreateAgitatorInput>) => Promise<void>;
    updateAgitator: (id: number, input: Partial<User>) => Promise<void>;
    deleteAgitator: (id: number) => Promise<void>;
    assignUIKs : (id: number, uiks: string[]) => Promise<void>;
}


export const useAgitatorsStore = create<AgitatorState>((set,get) => {
    return {
        agitators: [],
        loading: false,
        error: null,
        fetchAgitators: async (url) => {
            set({ loading: true, error: null });
            try {
                const { data } = await api.get<User[]>(`/users/${url}`); // только кореспонденты
                set({ agitators: data, loading: false });
            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>
                set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },
        createAgitator: async (user) => {
            set({ loading: true, error: null });
            try {
                const { data } = await api.post<User>("/users/create-agitator", user);
                set({ agitators: [...get().agitators, data], loading: false });
            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>
                set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },

        assignUIKs: async (userId, uiks) => {
            set({ loading: true, error: null });
            try {
                const { data } = await api.post<User>(`/users/assign-uiks`, { userId, uikCodes:uiks });
                set({ agitators: get().agitators.map(c => c.id === userId ? data : c), loading: false });
            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>
                set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },
        updateAgitator: async (id,input) => {
            set({ loading: true, error: null });
            try {
                const { data } = await api.put<User>(`/users/${id}`, input);
                set({ agitators: get().agitators.map(c => c.id === id ? data : c), loading: false });
            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>
                set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },
        
        deleteAgitator: async (id) => {
            set({loading:true, error:null})
            try{
                await api.delete(`/users/${id}`);
                set({ loading:false, error:null });
            }catch (err:unknown){
                const axiosError = err as AxiosError<{message:string}>
                set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },
    }
} );
