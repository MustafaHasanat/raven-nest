import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreatePermissionDto } from "./create-permission.dto";
import { PermissionAction } from "../../enums/permissions.enum";
import { IsEnum } from "class-validator";
import { TablesNames } from "../../enums/tables.enum";

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    // --- Original fields ---
    @ApiProperty({ required: false })
    description?: string;

    @IsEnum(PermissionAction)
    @ApiProperty({
        enum: PermissionAction,
        required: false,
    })
    action?: PermissionAction;

    @IsEnum(TablesNames)
    @ApiProperty({
        enum: TablesNames,
        required: false,
    })
    table?: TablesNames;

    // --- Relational fields ---
    @ApiProperty({
        required: false,
        description: "enter the related role ID",
    })
    role?: string;
}
