import { UserRole } from "../enums/users.enum";

export type TokenPayload = {
    userId: string;
    username?: string;
    email?: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
};

export type FullTokenPayload = TokenPayload & {
    iat: number;
    exp: number;
};
