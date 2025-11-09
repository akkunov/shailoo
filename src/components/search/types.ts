// types.ts
export interface UserUIK {
    uikCode: string;
    uik: { id: number; name: string };
}

export interface Agitator {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    uiks: UserUIK[];
}

export interface Voter {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
}
