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
import { DeleteResult, FindManyOptions, UpdateResult } from "typeorm";
import { Request, Response } from "express";
import { User } from "../../entities/user.entity";
import { UsersService } from "./users.service";
import { CreateUserDto } from "../../common/dto/users/create-user.dto";
import { UpdateUserDto } from "../../common/dto/users/update-user.dto";
import { TablesNames, UserFields } from "../../common/enums/tables.enum";
import {
    EditorsWrapper,
    ControllerWrapper,
    GetAllByQuery,
    DeletionQuery,
    GetOneByQuery,
} from "../../common/decorators";
import { CustomResponseType, DeleteQueryProps } from "../../common/types";
import { RELATIONS_OBJECT } from "../../common/constants/relations";
import { DELETE_Pipe, GET_Pipe, POST_PATCH_Pipe } from "../../common/pipes";
import { getUserTokenData } from "../../common/helpers";

@ControllerWrapper("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // --- Basic CRUD endpoints ---

    @Get()
    @GetAllByQuery({
        fieldsEnum: UserFields,
        descendants: RELATIONS_OBJECT.user.descendants,
    })
    async getUsers(
        @Query(new GET_Pipe(UserFields, RELATIONS_OBJECT.user.ascendants))
        query: FindManyOptions,
        @Res() res: Response
    ) {
        const response: CustomResponseType<User[]> =
            await this.usersService.getUsers(query);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @GetOneByQuery({
        summary: "get a single user using its ID",
    })
    async getUserById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<User> =
            await this.usersService.getUserById(id);
        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateUserDto, "create a new user")
    async createUser(
        @Body(new POST_PATCH_Pipe(TablesNames.USERS))
        createUserDto: CreateUserDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<User> =
            await this.usersService.createUser(
                createUserDto,
                getUserTokenData(req)
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateUserDto, "update a user")
    async updateUser(
        @Param("id") id: string,
        @Body(new POST_PATCH_Pipe(TablesNames.USERS))
        updateUserDto: UpdateUserDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.usersService.updateUser(
                id,
                updateUserDto,
                getUserTokenData(req)
            );

        return res.status(response.status).json(response);
    }

    @Delete()
    @DeletionQuery("delete users")
    async deleteUser(
        @Query(new DELETE_Pipe()) query: DeleteQueryProps,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<DeleteResult> =
            await this.usersService.deleteUser(query, getUserTokenData(req));

        return res.status(response.status).json(response);
    }
}
