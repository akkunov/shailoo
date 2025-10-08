// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios, { AxiosError } from "axios";
import type {User} from "@/types/models.ts";

interface LoginResponse {
    user: User;
    token: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;

    login: (phone: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,
            error: null,

            setUser: (user: User, token: string) =>
                set({ user, token, error: null }),

            login: async (phone: string, password: string) => {
                set({ loading: true, error: null });
                try {
                    const response = await axios.post<LoginResponse>("/auth/login", {
                        phone,
                        password,
                    });
                    localStorage.setItem("token", response.data.token);
                    console.log(response.data)
                    set({
                        user: response.data.user,
                        token: response.data.token,
                        loading: false,
                    });

                    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
                } catch (err) {
                    let message = "Неизвестная ошибка";
                    if (axios.isAxiosError(err)) {
                        const axiosError = err as AxiosError<{ message: string }>;
                        message = axiosError.response?.data?.message || axiosError.message;
                    }
                    set({ error: message, loading: false });
                }
            },

            logout: () => {
                set({ user: null, token: null, error: null });
                delete axios.defaults.headers.common["Authorization"];
            },
        }),
        { name: "auth-storage" } // ключ в localStorage
    )
);
