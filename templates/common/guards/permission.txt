/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    NotImplementedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission, Role } from "../../entities";
import { In, Repository } from "typeorm";
import { PermissionAction } from "../enums/permissions.enum";
import { TablesNames } from "../enums/tables.enum";

/**
 * This guard run before each endpoint in the system to check if the request is authorized,
 * otherwise it throws an error
 */
@Injectable()
export class PermissionGuard implements CanActivate {
    /**
     * @param roleRepository The repository object of the Role table
     * @param permissionRepository The repository object of the Permission table
     */
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) {}

    /**
     * Identify the current used action (PermissionAction enum)
     *
     * @param method The name of the used HTTP method coming from the request
     * @param path The path of the HTTP request (the endpoint path)
     * @returns PermissionAction enum type
     */
    private getAction(method: string, path: string): PermissionAction {
        if (method === "POST") return PermissionAction.CREATE;
        else if (method === "PATCH") return PermissionAction.UPDATE;
        else if (method === "DELETE") return PermissionAction.DELETE;
        else if (method === "GET" && path.indexOf("/") !== -1)
            return PermissionAction.GET_ONE;
        return PermissionAction.GET_ALL;
    }

    /**
     * Used to check if the current database has records with the names
     * "admin" and "public" in the "Role" table
     */
    private async checkMinimalRoles(): Promise<void> {
        const roles = await this.roleRepository.find({
            where: {
                name: In(["admin", "public"]),
            },
        });

        if (roles?.length < 2)
            throw new NotImplementedException(
                "You haven't created any roles yet, you need to create at least the 'admin' and the 'public' roles to start"
            );
    }

    /**
     * Get the roles that have the same provided role name
     *
     * @param roleName The role name of the current signed in user, gets 'public' if the user is not signed in
     * @returns
     */
    private async getRoles(roleName?: string): Promise<Role[]> {
        const roles = await this.roleRepository.find({
            where: {
                name: roleName,
            },
        });

        if (!roles)
            throw new InternalServerErrorException(
                "Error while fetching the roles in the guard"
            );

        return roles;
    }

    /**
     * Checks whether you are authenticated or not to request the endpoint
     *
     * @param action PermissionAction
     * @param path The current path to the endpoint
     * @param roles
     * @param roleName The role name of the current user, gets 'public' for non-signed in users
     */
    private async checkPermissions(
        action: PermissionAction,
        path: TablesNames,
        roles: Role[],
        roleName: string
    ): Promise<void> {
        const permissions = await this.permissionRepository.find({
            relations: ["role"],
            where: {
                action,
                table: path,
                role: {
                    name: roleName === "public" ? "public" : roles[0]?.name,
                },
            },
        });

        if (permissions.length === 0)
            throw new UnauthorizedException(
                "You don't have permission to access this endpoint"
            );
    }

    /**
     * This method is the main one that determines whether the request is authorized and
     * authenticated or not by returning true or raising an exception.
     *
     * @param context ExecutionContext
     * @returns boolean
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // get the pathname for the request
        const initialPathname = request.path;
        if (!initialPathname)
            throw new InternalServerErrorException("Pathname was not found");
        const pathname = initialPathname.slice(1);
        const slashIndex = pathname.indexOf("/");
        const path =
            slashIndex !== -1 ? pathname.slice(0, slashIndex) : pathname;

        // check the user's role
        const roleName: string | undefined = request.user?.role;

        // provide admins with full access
        if (roleName === "admin") return true;

        // get the current action
        const action = this.getAction(request.method, pathname);

        // make the "create user" and "auth" endpoints public ones
        if (
            (path === "user" && action === PermissionAction.CREATE) ||
            path === "auth"
        )
            return true;

        // check the minimal rows you need to have to start
        await this.checkMinimalRoles();

        // get the existing roles
        const roles = await this.getRoles(roleName);

        // check the permissions
        await this.checkPermissions(action, path, roles, roleName || "public");

        return true;
    }
}
