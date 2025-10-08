import { create } from "zustand";
import type { Role } from "@/types/models";

export interface UserAuth {
    id: number;
    firstName: string;
    lastName: string;
    role: Role;
}

interface UserStore {
    user: UserAuth | null;
    setUser: (user: UserAuth | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
