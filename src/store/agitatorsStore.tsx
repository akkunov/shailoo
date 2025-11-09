import type {User} from "@/types/models.ts";
import {create} from "zustand";
import {api} from "@/api/axios.ts";
import axios, {type AxiosError} from "axios";

export type Result<T = void> =
    | { success: true; data?: T }
    | { success: false; message: string };


export interface CreateAgitatorInput {
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
    createAgitator: (input: Partial<CreateAgitatorInput>) => Promise<Result<User>>;
    updateAgitator: (id: number, input: Partial<CreateAgitatorInput>) => Promise<void>;
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
                return { success: true,data: data };
            } catch (err:unknown) {
                let message = "Неизвестная ошибка";
                if (axios.isAxiosError(err)) {
                    const axiosError = err as AxiosError<{ message: string }>;
                    message = axiosError.response?.data?.message || axiosError.message;
                }
                set({loading: false });
                return { success: false, message };
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
        updateAgitator: async (id, input: Partial<CreateAgitatorInput>) => {
            set({ loading: true, error: null });
            try {
                const { data } = await api.put<User>(`/users/${id}`, input);
                set({
                    agitators: get().agitators.map(c => c.id === id ? data : c),
                    loading: false
                });
            } catch (err: unknown) {
                const axiosError = err as AxiosError<{ message: string }>;
                set({
                    error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при обновлении",
                    loading: false
                });
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
