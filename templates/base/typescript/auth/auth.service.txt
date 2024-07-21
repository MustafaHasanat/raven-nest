/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { mailing } from "../../common/constants/services";
import { sendEmail } from "../../common/helpers";
import { errorRes, invalidRes, validRes } from "../../common/responses";
import { emailValidator } from "../../common/middlewares";
import { UsersService } from "../users/users.service";
import { CustomResponseType, TokenPayload } from "../../common/types";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly usersService: UsersService
    ) {}

    async validateToken(token: string): Promise<CustomResponseType<string>> {
        try {
            const decoded = this.jwtService.verify(token);
            if (!decoded) return invalidRes("Invalid token", token);

            const { exp, iat, userId } = decoded;

            if (exp - iat < 0) return invalidRes("Token has expired!", token);

            const userToken = await this.usersService.getTokenById(userId);
            if (userToken.payload !== token) {
                return invalidRes("Invalid token", token);
            }

            return validRes("Token is valid", decoded);
        } catch (error) {
            return errorRes(`Token is invalid: ${error.message}`);
        }
    }

    async logIn(
        email: string,
        password: string
    ): Promise<CustomResponseType<string>> {
        try {
            const user = await this.usersService.checkUserCredentials({
                email,
                password,
            });

            if (user.status !== 200) {
                return { ...user, payload: null };
            }

            const { password: userPass, id, token, ...rest } = user.payload;

            const payload: TokenPayload = {
                userId: id,
                ...rest,
            };

            return validRes(
                "Token has been generated",
                await this.jwtService.signAsync(payload)
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async requestPasswordReset(
        email: string
    ): Promise<CustomResponseType<string>> {
        try {
            const user = await this.usersService.checkUserCredentials({
                email,
                isOnlyEmail: true,
            });

            if (user.status !== 200) {
                return { ...user, payload: null };
            }

            const token = await this.jwtService.signAsync({
                userId: user.payload.id,
                email: user.payload.email,
            });

            const updateResponse = await this.usersService.updateToken(
                email,
                token
            );
            if (updateResponse.status === 500)
                throw new Error("Couldn't update the token");

            const response = await sendEmail(
                mailing.passwordRequest(
                    user.payload.email,
                    process.env.ENVIRONMENT,
                    token
                ),
                this.mailerService
            );

            return response;
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async resetPassword(
        identifier: string,
        newPassword: string,
        token: string
    ): Promise<CustomResponseType<any>> {
        try {
            const response = await this.validateToken(token);
            if (response.status !== 200)
                return invalidRes(response.message, response.payload);

            return await this.usersService.updatePassword(
                identifier,
                newPassword
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
