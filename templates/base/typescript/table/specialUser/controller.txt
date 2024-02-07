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
    UploadedFile,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Request, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

import {
    EditorsWrapper,
    MembersOnly,
    GetAllWrapper,
    AdminsOnly,
    GetConditionsProps,
    GetQueryProps,
    CustomResponseType,
    ControllerWrapper,
    validateGetConditions,
} from "src/ravennest";

import { User } from "src/entities/user.entity";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/dto/users/create-user.dto";
import { UpdateUserDto } from "src/dto/users/update-user.dto";
import { UserFields, TablesNames } from "src/enums/tables-data.enum";
import { FullTokenPayload } from "src/types/token-payload.type";
import { newInstanceTransformer } from "src/middlewares/transformers";

@ControllerWrapper("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    private getUserTokenData(
        req: Request<Record<string, any>>
    ): FullTokenPayload {
        return this.usersService.getUserTokenData(req);
    }

    @Get()
    @AdminsOnly()
    @GetAllWrapper({
        fieldsEnum: UserFields,
    })
    async getUsers(
        @Query()
        query: GetQueryProps<UserFields>,
        @Res() res: Response
    ) {
        const { sortBy, reverse, page, conditions } = query;
        const parsed: GetConditionsProps<UserFields>[] =
            validateGetConditions<UserFields>(conditions);

        const response: CustomResponseType<any> =
            await this.usersService.getUsers({
                sortBy: sortBy || UserFields.USERNAME,
                reverse: reverse === "true",
                page: Number(page),
                conditions: parsed || [],
            });
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single user using its ID" })
    async getUserById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<any> =
            await this.usersService.getUserById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(
        CreateUserDto,
        "create a new user",
        FileInterceptor("avatar")
    )
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: "User successfully created." })
    async createUser(
        @UploadedFile() avatar: Express.Multer.File,
        @Body() createUserDto: CreateUserDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<User> =
            await this.usersService.createUser(
                {
                    ...newInstanceTransformer<CreateUserDto>(
                        createUserDto,
                        TablesNames.USERS
                    ),
                    avatar,
                },
                this.getUserTokenData(req)
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @MembersOnly()
    @EditorsWrapper(UpdateUserDto, "update a user", FileInterceptor("avatar"))
    async updateUser(
        @Param("id") id: string,
        @UploadedFile() avatar: Express.Multer.File,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.usersService.updateUser(
                id,
                {
                    ...newInstanceTransformer<CreateUserDto>(
                        updateUserDto,
                        TablesNames.USERS
                    ),
                    avatar,
                },
                this.getUserTokenData(req)
            );

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    @AdminsOnly()
    @ApiOperation({ summary: "delete all users" })
    async deleteAllUsers(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.usersService.deleteAllUsers();
        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @MembersOnly()
    @ApiOperation({ summary: "delete a user" })
    async deleteUser(
        @Param("id") id: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<DeleteResult> =
            await this.usersService.deleteUser(id, this.getUserTokenData(req));
        return res.status(response.status).json(response);
    }
}
