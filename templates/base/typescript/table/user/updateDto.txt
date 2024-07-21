import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { UserRole } from "../../enums/users.enum";
import { IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // --- Original fields ---
    @IsOptional()
    @ApiProperty({ default: "", example: "", required: false })
    username?: string;

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
    role?: UserRole;
}
