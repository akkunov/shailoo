import type {Voter} from "@/types/models.ts";
import {create} from "zustand";
import {api} from "@/api/axios.ts";
import type {AxiosError} from "axios";

interface VotersState {
    voters: Voter[];
    loading: boolean;
    error: string | null;

    fetchVoters: () => Promise<void>;
}

export const useVotersStore = create<VotersState>((setState) => {
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
        }
    }

})
