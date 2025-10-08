export type Role = "ADMIN" | "COORDINATOR" | "AGITATOR";
export const Roles = {
    ADMIN: "ADMIN",
    COORDINATOR: "COORDINATOR",
    AGITATOR: "AGITATOR",
};

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    pin: string;
    role: Role;
    coordinatorId?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface UIK {
    code: number;
    name: string;
}

export interface Voter {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    phone?: string;
    address?: string;
    pin?: string;
    uikCode: number;
    addedById: number;
    createdAt: string;
    uik?: UIK;
    addedBy?: User;
}
