import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { DeleteResult, FindManyOptions, UpdateResult } from "typeorm";
import { Request, Response } from "express";
import { RolesService } from "./roles.service";
import {
    EditorsWrapper,
    ControllerWrapper,
    GetAllByQuery,
} from "../../common/decorators";
import { CustomResponseType, DeleteQueryProps } from "../../common/types";
import { RoleFields, TablesNames } from "../../common/enums/tables.enum";
import { RELATIONS_OBJECT } from "../../common/constants/relations";
import { DELETE_Pipe, GET_Pipe, POST_PATCH_Pipe } from "../../common/pipes";
import { Role } from "../../entities/role.entity";
import { CreateRoleDto } from "../../common/dto/roles/create-role.dto";
import { UpdateRoleDto } from "../../common/dto/roles/update-role.dto";
import { DeletionQuery } from "src/common/decorators/delete.decorator";
import { getUserTokenData } from "src/common/helpers";

@ControllerWrapper("role")
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    // --- Basic CRUD endpoints ---

    @Get()
    @GetAllByQuery({
        fieldsEnum: RoleFields,
        descendants: RELATIONS_OBJECT.role.descendants,
    })
    async getRoles(
        @Query(new GET_Pipe(RoleFields, RELATIONS_OBJECT.role.ascendants))
        query: FindManyOptions,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Role[]> =
            await this.rolesService.getRoles(query);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single role using its ID" })
    async getRoleById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Role> =
            await this.rolesService.getRoleById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateRoleDto, "create a new role")
    async createRole(
        @Body(new POST_PATCH_Pipe(TablesNames.ROLE))
        createRoleDto: CreateRoleDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Role> =
            await this.rolesService.createRole(
                createRoleDto,
                getUserTokenData(req)
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateRoleDto, "update a role")
    async updateRole(
        @Param("id") id: string,
        @Body(new POST_PATCH_Pipe(TablesNames.ROLE))
        updateRoleDto: UpdateRoleDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.rolesService.updateRole(id, updateRoleDto);

        return res.status(response.status).json(response);
    }

    @Delete()
    @DeletionQuery("delete roles")
    async deleteRole(
        @Query(new DELETE_Pipe()) query: DeleteQueryProps,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<DeleteResult> =
            await this.rolesService.deleteRole(query, getUserTokenData(req));

        return res.status(response.status).json(response);
    }
}
