import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";

export function DeletionQuery(summary: string) {
    return applyDecorators(
        ApiOperation({ summary }),
        ApiQuery({
            name: "id",
            type: "string",
            required: false,
            description: "the id of the targeted record",
        }),
        ApiQuery({
            name: "wipe",
            type: "boolean",
            required: false,
            example: false,
            description: "wipe all data for this table",
        })
    );
}
