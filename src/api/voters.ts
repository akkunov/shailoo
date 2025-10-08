import { api } from "./axios";
import type { Voter } from "@/types/models";

export interface VoterInput {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone?: string;
    address?: string;
    pin?: string;
    uikCode: number;
}

export const voterApi = {
    getAll: async (): Promise<Voter[]> => {
        const { data } = await api.get<Voter[]>("/voters");
        return data;
    },

    create: async (payload: VoterInput): Promise<Voter> => {
        const { data } = await api.post<Voter>("/voters", payload);
        return data;
    },

    update: async (id: number, payload: Partial<VoterInput>): Promise<Voter> => {
        const { data } = await api.put<Voter>(`/voters/${id}`, payload);
        return data;
    },

    remove: async (id: number): Promise<{ success: boolean }> => {
        const { data } = await api.delete<{ success: boolean }>(`/voters/${id}`);
        return data;
    },
};
