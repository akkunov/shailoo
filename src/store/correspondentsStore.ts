// src/store/correspondentsStore.ts
import { create } from "zustand";
import { api } from "@/api/axios";
import type { User } from "@/types/models";
import type {AxiosError} from "axios";

export interface CorrespondentsState {
    correspondents: User[];          // список всех кореспондентов
    loading: boolean;                // индикатор загрузки
    error: string | null;            // текст ошибки или null

    fetchCorrespondents: () => Promise<void>;                         // получить всех кореспондентов
    createCorrespondent: (input: Omit<User, "id" | "createdAt" | "updatedAt">) => Promise<void>; // создать нового
    updateCorrespondent: (id: number, input: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>) => Promise<void>; // изменить существующего
    deleteCorrespondent: (id: number) => Promise<void>;               // удалить по id
}

export const useCorrespondentsStore = create<CorrespondentsState>((set, get) => ({
    correspondents: [],
    loading: false,
    error: null,

    fetchCorrespondents: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get<User[]>("/users/coordinators"); // только кореспонденты
            set({ correspondents: data, loading: false });
        } catch (err:unknown) {
            const axiosError = err as AxiosError<{message:string}>
            set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
        }
    },

    createCorrespondent: async (input) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post<User>("/users/create-coordinator", input);
            set({ correspondents: [...get().correspondents, data], loading: false });
        } catch (err:unknown) {
            const axiosError = err as AxiosError<{message:string}>
            set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
        }
    },

    updateCorrespondent: async (id, input) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.put<User>(`/users/${id}`, input);
            set({
                correspondents: get().correspondents.map(c => c.id === id ? data : c),
                loading: false,
            });
        } catch (err:unknown) {
            const axiosError = err as AxiosError<{message:string}>
            set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
        }
    },

    deleteCorrespondent: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/users/${id}`);
            set({ correspondents: get().correspondents.filter(c => c.id !== id), loading: false });
        } catch (err:unknown) {
            const axiosError = err as AxiosError<{message:string}>
            set({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
        }
    },
}));
