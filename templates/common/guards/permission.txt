/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission, Role } from "../../entities";
import { Repository } from "typeorm";
import { PermissionAction } from "../enums/permissions.enum";
import { TablesNames } from "../enums/tables.enum";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) {}

    private getAction(method: string, path: string): PermissionAction {
        if (method === "POST") return PermissionAction.CREATE;
        else if (method === "PATCH") return PermissionAction.UPDATE;
        else if (method === "DELETE") return PermissionAction.DELETE;
        else if (method === "GET" && path.indexOf("/") !== -1)
            return PermissionAction.GET_ONE;
        return PermissionAction.GET_ALL;
    }

    private async getRole(roleName: string) {
        const role = await this.roleRepository.find({
            where: {
                name: roleName,
            },
        });

        if (!role)
            throw new InternalServerErrorException(
                "Internal server error occurred"
            );

        return role;
    }

    private async checkPermissions(
        action: PermissionAction,
        path: TablesNames,
        role: Role[]
    ) {
        const permissions = await this.permissionRepository.find({
            relations: ["role"],
            where: {
                action,
                table: path,
                role,
            },
        });

        if (permissions.length === 0)
            throw new UnauthorizedException(
                "You don't have permission to access this endpoint"
            );
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // get the pathname for the request
        const pathname = request._parsedOriginalUrl?.pathname.slice(1);
        const slashIndex = pathname.indexOf("/");
        const path =
            slashIndex !== -1 ? pathname.slice(0, slashIndex) : pathname;

        // check the user's role
        const roleName = request.user?.role;
        if (roleName === "admin") return true;

        // get the current action
        const action = this.getAction(request.method, pathname);

        // get the existing roles
        const role = await this.getRole(roleName);

        // check the permissions
        await this.checkPermissions(action, path, role);

        return true;
    }
}
