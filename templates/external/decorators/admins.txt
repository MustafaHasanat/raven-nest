import { SetMetadata } from "@nestjs/common";

export const AdminsOnly = () => SetMetadata("isAdmin", true);
