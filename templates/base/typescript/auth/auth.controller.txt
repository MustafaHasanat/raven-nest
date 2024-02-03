import {
    Body,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LoginUserDto } from "src/dto/users/login-user.dto";
import { ControllerWrapper } from "src/ravennest";
import { UsersService } from "src/schemas/users/users.service";
import { AuthService } from "./auth.service";

@ControllerWrapper("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}

    @Get("isAuth")
    @ApiOperation({ summary: "check if you are authenticated or not" })
    getProfile(@Req() req: Request, @Res() res: Response) {
        const token = this.usersService.getUserTokenData(req);
        return res.status(200).json({
            message: `User is ${token ? "authenticated" : "not authenticated"}`,
            data: token,
            status: 200,
        });
    }

    @Get("passwordReset")
    @ApiOperation({
        summary: "display the HTML page for resetting the password",
    })
    passwordReset(@Res() res: Response) {
        return res.render("passwordReset.hbs", {});
    }

    @Get("passwordRequest")
    @ApiOperation({
        summary:
            "request a password reset if you forgot yours providing your identifier (email or username)",
    })
    @HttpCode(HttpStatus.OK)
    async requestPasswordReset(
        @Query("identifier") identifier: string,
        @Res() res: Response
    ) {
        const response =
            await this.authService.requestPasswordReset(identifier);
        return res.status(response.status).json(response);
    }

    @Get("validate/:token")
    @ApiOperation({
        summary: "validate the given token (only used for password reset)",
    })
    async validateToken(@Param("token") token: string, @Res() res: Response) {
        const response = await this.authService.validateToken(token);

        return res.status(response.status).json(response);
    }

    @Post("login")
    @ApiOperation({
        summary: "log in to create a local auth token (only for logging in)",
    })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginUserDto })
    async logIn(@Body() body: LoginUserDto, @Res() res: Response) {
        const { email, password } = body;
        const response = await this.authService.logIn(email, password);
        return res.status(response.status).json(response);
    }

    @Post("passwordReset")
    @ApiOperation({
        summary:
            "reset your password providing your identifier (email or username) and token",
    })
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Query("identifier") identifier: string,
        @Query("newPassword") newPassword: string,
        @Query("token") token: string,
        @Res() res: Response
    ) {
        const response = await this.authService.resetPassword(
            identifier,
            newPassword,
            token
        );
        return res.status(response.status).json(response);
    }
}
