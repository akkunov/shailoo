import type {Voter} from "@/types/models.ts";
import {create} from "zustand";
import {api} from "@/api/axios.ts";
import axios, {type AxiosError} from "axios";

export type Result<T = void> =
    | { success: true; data?: T }
    | { success: false; message: string };


interface VotersState {
    voters: Voter[];
    loading: boolean;
    error: string | null;

    fetchVoters: () => Promise<void>;
    fetchVotersByCoordinatorId: (id?: number) => Promise<void>;
    createVoter: (voter:Partial<Voter> ) => Promise<Result<Voter>>;
    fetchVotersByAgitator: () => Promise<void>;
    deleteVoter: (id: number) => Promise<void>;
    updateVoter: (id: number, voter: Partial<Voter>) => Promise<void>;
}

export const useVotersStore = create<VotersState>((setState,get) => {
    return {
        voters: [],
        loading: false,
        error: null,

        fetchVoters: async () => {
            setState({ loading: true, error: null });
            try {
                const { data } = await api.get<Voter[]>("/users/voters");
                setState({ voters: data, loading: false });
            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>
                setState({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },
        fetchVotersByCoordinatorId: async (id) =>{
            try {
                if (id){
                    setState({ loading: true, error: null });
                    const { data } = await api.get<Voter[]>(`/users/coordinator-voters/${id}`);
                    setState({ voters: data, loading: false });
                }
                else alert('Нет пользвателья')
            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>
                setState({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },
        fetchVotersByAgitator: async () =>{
            try {
                    setState({ loading: true, error: null });
                    const { data } = await api.get<Voter[]>(`/voters/me`);
                    setState({ voters: data, loading: false });

            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>

                setState({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },
        createVoter: async (voter) => {
            setState({ loading: true, error: null });
            try {
                const { data } = await api.post<Voter>("/voters", voter);
                setState({ voters: [...get().voters, data], loading: false });
                return { success: true,data: data };
            } catch (err:unknown) {
                let message = "Неизвестная ошибка";
                if (axios.isAxiosError(err)) {
                    const axiosError = err as AxiosError<{ message: string }>;
                    message = axiosError.response?.data?.message || axiosError.message;
                }
                setState({loading: false });
                return { success: false, message };
            }
        },
        deleteVoter: async (id) => {
            setState({ loading: true, error: null });
            try {
                await api.delete<number>(`/voters/${id}`);
                setState({ voters: get().voters.filter(v => v.id !== id), loading: false });
            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>
                setState({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },
        updateVoter: async (id,input) => {
            setState({ loading: true, error: null });
            try {
                const { data } = await api.put<Voter>(`/voters/${id}`, input);
                setState({ voters: get().voters.map(v => v.id === id ? data : v), loading: false });
            } catch (err:unknown) {
                const axiosError = err as AxiosError<{message:string}>
                setState({ error: axiosError?.response?.data?.message || axiosError?.message || "Ошибка при загрузке", loading: false });
            }
        },

    }

})
