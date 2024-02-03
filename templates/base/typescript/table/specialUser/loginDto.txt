import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IsEmail, Length, Matches } from "class-validator";

export class EmailDto {
    @IsEmail()
    @ApiProperty({ example: "example@example.com", required: true })
    email: string;
}

export class PasswordDto {
    @Length(8, 25)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    @ApiProperty({
        example: "s5Rsa2?#sd1154",
        description:
            "password must contain lowercase letters, uppercase letters, numbers, and symbols. It must have length between (8, 25) characters",
        required: true,
    })
    password: string;
}

export class LoginUserDto extends IntersectionType(EmailDto, PasswordDto) {}
