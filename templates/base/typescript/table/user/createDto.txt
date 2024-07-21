import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import {
    IsNotEmpty,
    Length,
    IsEnum,
    IsOptional,
    IsAlphanumeric,
    NotContains,
} from "class-validator";
import { LoginUserDto } from "./login-user.dto";
import { UserRole } from "../../enums/users.enum";

export class CreateUserDto extends IntersectionType(LoginUserDto) {
    // --- Original fields ---
    @IsNotEmpty()
    @Length(3, 25)
    @IsAlphanumeric()
    @NotContains(" ")
    @ApiProperty({
        example: "Jack",
        description: "username must have length between (5, 25) characters",
        minLength: 3,
        maxLength: 25,
        required: true,
    })
    username: string;

    @IsOptional()
    @IsEnum(UserRole)
    @ApiProperty({
        example: UserRole.CUSTOMER,
        default: UserRole.CUSTOMER,
        enum: UserRole,
        required: true,
    })
    role: UserRole;

    @IsOptional()
    @ApiProperty({
        type: "string",
        format: "binary",
        example: "url",
        required: false,
    })
    avatar?: Express.Multer.File;

    // --- Additional fields ---
    @ApiProperty({
        example: "",
        description: "provide the app secret to create a new admin",
        required: false,
    })
    secret?: string;
}
