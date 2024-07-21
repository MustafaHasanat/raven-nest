import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    DeleteResult,
    FindManyOptions,
    Repository,
    UpdateResult,
} from "typeorm";
import {
    CustomResponseType,
    DeleteQueryProps,
    FullTokenPayload,
} from "../../common/types";
import { errorRes, newInstanceRes, updatedRes } from "../../common/responses";
import { CreatePermissionDto } from "../../common/dto/permissions/create-permission.dto";
import { UpdatePermissionDto } from "../../common/dto/permissions/update-permission.dto";
import {
    createHandler,
    deleteHandler,
    getAllHandler,
    getByIdHandler,
    updateHandler,
} from "../../common/helpers";
import { Permission } from "../../entities";

@Injectable()
export class PermissionsService {
    constructor(
        // ----- external services -----
        // ----- base services -----
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) {}

    // --- Basic CRUD APIs ---

    async getPermissions(
        query: FindManyOptions
    ): Promise<CustomResponseType<Permission[]>> {
        return await getAllHandler<Permission>({
            query,
            repository: this.permissionRepository,
            table: "Permissions",
        });
    }

    async getPermissionById(
        id: string
    ): Promise<CustomResponseType<Permission>> {
        return await getByIdHandler<Permission>({
            id,
            repository: this.permissionRepository,
            table: "Permission",
        });
    }

    async createPermission(
        createPermissionDto: CreatePermissionDto
    ): Promise<CustomResponseType<Permission>> {
        try {
            const response = await createHandler<Permission>({
                dto: createPermissionDto,
                repository: this.permissionRepository,
            });

            return newInstanceRes<Permission>(
                "Permission has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updatePermission(
        id: string,
        updatePermissionDto: UpdatePermissionDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            const response = await updateHandler<Permission>({
                id,
                dto: updatePermissionDto,
                table: "Permission",
                repository: this.permissionRepository,
            });

            return updatedRes<UpdateResult>(
                "Permission has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deletePermission(
        query: DeleteQueryProps,
        userTokenData: FullTokenPayload
    ): Promise<CustomResponseType<DeleteResult>> {
        const { id, wipe } = query;

        return await deleteHandler<Permission>({
            id,
            wipe,
            repository: this.permissionRepository,
            table: "Permission",
            userTokenData,
        });
    }
}
