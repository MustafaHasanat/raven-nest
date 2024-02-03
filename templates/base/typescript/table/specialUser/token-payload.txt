import { UserRole, UserGender } from "src/enums/users.enum";

export type TokenPayload = {
    userId: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    gender?: UserGender;
    role?: UserRole;
    createdAt?: Date;
};

export type FullTokenPayload = TokenPayload & {
    iat: number;
    exp: number;
};
