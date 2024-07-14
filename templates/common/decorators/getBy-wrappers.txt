import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { SwaggerEnumType } from "@nestjs/swagger/dist/types/swagger-enum.type.js";
import { FilterOperator } from "../enums/filters";

const conditionsDecorator = (fieldsEnum: SwaggerEnumType) =>
    ApiQuery({
        name: "conditions",
        required: false,
        isArray: true,
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    field: {
                        type: "enum",
                        enum: Object.values(fieldsEnum),
                    },
                    filteredTerm: {
                        type: "object",
                        properties: {
                            dataType: { type: "string" },
                            value: {
                                type: "enum",
                                enum: ["string", "number"],
                            },
                        },
                    },
                    filterOperator: {
                        type: "enum",
                        enum: Object.values(FilterOperator),
                    },
                },
            },
        },
    });

const descendantsDecorator = (descendants: string[] = []) =>
    ApiQuery({
        name: "descendants",
        required: false,
        isArray: true,
        description:
            "for each record, get an array of items related to the input table (one-to-many relations)",
        schema: {
            type: "array",
            items: {
                type: "enum",
                enum: descendants,
            },
        },
    });

const ascendantsDecorator = () =>
    ApiQuery({
        name: "ascendants",
        required: false,
        example: {},
        description:
            'get all records that have the ID of the input table (many-to-one relations) => e.g. { TABLE_NAME: { id: "xxx-xxx-xxx" } }',
        schema: {
            type: "object",
            properties: {
                TABLE_NAME: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                        },
                    },
                },
            },
        },
    });

export function GetAllByQuery({
    fieldsEnum,
    descendants,
    summary = "get all instances that follows the filters",
}: {
    fieldsEnum: SwaggerEnumType;
    descendants: string[];
    summary?: string;
}) {
    const baseDecorators = applyDecorators(
        ApiOperation({ summary }),
        ApiQuery({
            name: "sortBy",
            type: "enum",
            required: false,
            enum: fieldsEnum,
            example: Object.values(fieldsEnum)[0],
            description:
                "select the field of which the records should be sorted by",
        }),
        ApiQuery({
            name: "reverse",
            type: "boolean",
            required: false,
            example: false,
            description: "reverse the order of the rows",
        }),
        ApiQuery({
            name: "page",
            type: "number",
            required: false,
            example: 1,
            description:
                "specify the number of the page (0 will get all records)",
        }),
        ApiQuery({
            name: "capacity",
            type: "number",
            required: false,
            example: 5,
            description:
                "specify the capacity of the single page (how many records per page)",
        }),
        ApiQuery({
            name: "ids",
            required: false,
            isArray: true,
            schema: {
                type: "array",
                items: {
                    type: "string",
                },
            },
            description:
                "only return the records which their IDs occur in the array",
        })
    );

    return applyDecorators(
        conditionsDecorator(fieldsEnum),
        descendantsDecorator(descendants),
        ascendantsDecorator(),
        baseDecorators
    );
}

export function GetOneByQuery({
    summary = "get a single record using its ID",
}: {
    summary?: string;
}) {
    const baseDecorators = applyDecorators(ApiOperation({ summary }));

    return applyDecorators(baseDecorators);
}
