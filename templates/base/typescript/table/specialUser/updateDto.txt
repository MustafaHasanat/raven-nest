import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { UserGender, UserRole } from "src/enums/users.enum";
import { IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    username?: string;

    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    firstName?: string;

    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    lastName?: string;

    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    email?: string;

    @IsOptional()
    @ApiProperty({
        default: "",
        example: "",
        required: false,
        readOnly: true,
    })
    password?: string;

    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    phoneNumber?: string;

    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    address?: string;

    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    gender?: UserGender;

    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    role?: UserRole;

    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    avatar?: Express.Multer.File;
}
