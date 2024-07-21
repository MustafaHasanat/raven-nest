import { Injectable, UnauthorizedException } from "@nestjs/common";
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
import { CreateRoleDto } from "../../common/dto/roles/create-role.dto";
import { UpdateRoleDto } from "../../common/dto/roles/update-role.dto";
import {
    createHandler,
    deleteHandler,
    getAllHandler,
    getByIdHandler,
    updateHandler,
} from "../../common/helpers";
import { Role } from "../../entities";
import { UserRole } from "src/common/enums/users.enum";

@Injectable()
export class RolesService {
    constructor(
        // ----- external services -----
        // ----- base services -----
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) {}

    // --- Basic CRUD APIs ---

    async getRoles(
        query: FindManyOptions
    ): Promise<CustomResponseType<Role[]>> {
        return await getAllHandler<Role>({
            query,
            repository: this.roleRepository,
            table: "Roles",
        });
    }

    async getRoleById(id: string): Promise<CustomResponseType<Role>> {
        return await getByIdHandler<Role>({
            id,
            repository: this.roleRepository,
            table: "Role",
        });
    }

    async createRole(
        createRoleDto: CreateRoleDto,
        userTokenData: FullTokenPayload
    ): Promise<CustomResponseType<Role>> {
        try {
            // prevent non-admins from creating new roles
            if (userTokenData?.role !== UserRole.ADMIN) {
                throw new UnauthorizedException(
                    "Unauthorized, only admins can create new roles"
                );
            }

            const response = await createHandler<Role>({
                dto: createRoleDto,
                repository: this.roleRepository,
            });

            return newInstanceRes<Role>(
                "Role has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateRole(
        id: string,
        updateRoleDto: UpdateRoleDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            const response = await updateHandler<Role>({
                id,
                dto: updateRoleDto,
                table: "Role",
                repository: this.roleRepository,
            });

            return updatedRes<UpdateResult>(
                "Role has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteRole(
        query: DeleteQueryProps,
        userTokenData: FullTokenPayload
    ): Promise<CustomResponseType<DeleteResult>> {
        const { id, wipe } = query;

        return await deleteHandler<Role>({
            id,
            wipe,
            repository: this.roleRepository,
            table: "Role",
            userTokenData,
        });
    }
}
