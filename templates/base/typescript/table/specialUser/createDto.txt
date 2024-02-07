import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import {
    IsNotEmpty,
    Length,
    IsPhoneNumber,
    IsEnum,
    IsOptional,
    IsAlphanumeric,
    NotContains,
} from "class-validator";
import { LoginUserDto } from "./login-user.dto";
import { UserGender, UserRole } from "src/enums/users.enum";

export class CreateUserDto extends IntersectionType(LoginUserDto) {
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

    @IsNotEmpty()
    @Length(2, 25)
    @ApiProperty({
        example: "Jack",
        description: "firstName must have length between (2, 25) characters",
        required: true,
        minLength: 3,
        maxLength: 25,
    })
    firstName: string;

    @IsNotEmpty()
    @Length(2, 25)
    @ApiProperty({
        example: "Jack",
        description: "lastName must have length between (2, 25) characters",
        required: true,
        minLength: 3,
        maxLength: 25,
    })
    lastName: string;

    @IsOptional()
    @IsPhoneNumber()
    @ApiProperty({
        example: "+962780387522",
        description:
            "Phone number must start with a plus sign followed by country code, then the number",
        required: false,
    })
    phoneNumber?: string;

    @IsOptional()
    @Length(1, 255)
    @ApiProperty({
        example: "example st.",
        description: "Address of the user",
        required: false,
    })
    address?: string;

    @IsOptional()
    @IsEnum(UserGender)
    @ApiProperty({
        example: UserGender.MALE,
        default: UserGender.NOT_SPECIFIED,
        enum: UserGender,
        required: true,
    })
    gender: UserGender;

    @IsOptional()
    @IsEnum(UserRole)
    @ApiProperty({
        example: UserRole.MEMBER,
        default: UserRole.MEMBER,
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
}
