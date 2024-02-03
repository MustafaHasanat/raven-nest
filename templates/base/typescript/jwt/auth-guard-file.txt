import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserRole } from "src/enums/users.enum";
import { User } from "src/entities/user.entity";
import { UsersService } from "src/schemas/users/users.service";

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private readonly usersService: UsersService
    ) {}

    /**
     * Use the provided keys to detect the decorators existence
     *
     * @param keys an array of decorated keys
     * @param context the context of the guard
     * @returns an array of mapped booleans where each one refers to its key
     */
    private getDecoratorKeys(
        keys: string[],
        context: ExecutionContext
    ): boolean[] {
        return keys.map((key) => {
            return this.reflector.getAllAndOverride<boolean>(key, [
                context.getHandler(),
                context.getClass(),
            ]);
        });
    }

    /**
     * Get the Bearer Token from the request's header if existed
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }

    /**
     * This will be run automatically to validate every endpoint in the app
     * to check the authorization level of the user and prevent any unauthorized requests
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const [membersOnly, adminsOnly] = this.getDecoratorKeys(
            ["isMember", "isAdmin"],
            context
        );

        // get the token from the request
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        try {
            // prepare an object to be passed to the request under the name 'user', it will use
            // the token to check if the user is authenticated or not
            // if the token is undefined (a guest user), pass a nullable value
            const payload = token
                ? await this.jwtService.verifyAsync(token, {
                      secret: process.env.JWT_SECRET,
                  })
                : {};

            // pass the payload object to the request under the name 'user' so we can check for the
            // user's info anywhere in the app
            request["user"] = payload;

            // get the user using its ID if the token exists, otherwise pass a nullable value
            const user: { data: User } = payload
                ? await this.usersService.getUserById(payload?.userId)
                : { data: null };

            // if both of them are false (membersOnly, adminsOnly) -> it's a public endpoint
            // means that no restrictions on it
            if (!membersOnly && !adminsOnly) {
                return true;
            }

            // ----- from here, the endpoint is not public -----

            // if the token is undefined -> it's a guest user
            // a guest user can't pass this endpoint since it's not public
            if (!token) {
                throw new UnauthorizedException(
                    `Unauthorized request, ${
                        adminsOnly ? "admins" : "members"
                    } only`
                );
            }

            // ----- from here, the endpoint is for members and admins -----

            // if the user is a member and the endpoint is for admins, block him here
            // a member user can't pass this endpoint since it's only for admins
            if (user?.data?.role === UserRole.MEMBER && adminsOnly) {
                throw new UnauthorizedException(
                    "Unauthorized request, admins only"
                );
            }
        } catch (error) {
            throw new BadRequestException({
                message: "Unexpected error occurred",
                data: error.response,
                status: 500,
            });
        }

        // ----- from here, the endpoint is admins only -----

        return true;
    }
}
