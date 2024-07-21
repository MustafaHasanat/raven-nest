import { ApiProperty } from "@nestjs/swagger";
import { PermissionAction } from "../../enums/permissions.enum";
import { TablesNames } from "../../enums/tables.enum";
import { IsEnum, IsOptional } from "class-validator";

export class CreatePermissionDto {
    // --- Original fields ---

    @IsEnum(PermissionAction)
    @ApiProperty({
        example: PermissionAction.GET_ALL,
        default: PermissionAction.GET_ALL,
        enum: PermissionAction,
        required: true,
    })
    action: PermissionAction;

    @IsEnum(TablesNames)
    @ApiProperty({
        enum: TablesNames,
        required: true,
    })
    table: TablesNames;

    @IsOptional()
    @ApiProperty({ required: false, default: "" })
    description?: string;

    // --- Relational fields ---
    @ApiProperty({
        required: true,
        description: "enter the related role ID",
        default: "",
    })
    role: string;
}
