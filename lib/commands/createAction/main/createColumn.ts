import { columnTypeDefaultMap } from "../../../utils/constants/builderMaps.js";
import { CreateColumnProps } from "../../../interfaces/builder.js";
import { InjectTemplate } from "../../../types/injectTemplate.js";
import { join } from "path";

const createColumnInjection = ({
    columnData: {
        columnName,
        columnType,
        entityProperties,
        dtoProperties,
        decorators: { decoratorsValues, decoratorsImports },
        specialInjections,
    },
    paths: { entitiesPath, dtoPath, enumsPath, schemasPath },
    tableNameVariants: { camelCaseName, upperCaseName, pluralLowerCaseName },
    columNameVariants: { upperSnakeCaseName },
}: CreateColumnProps): InjectTemplate[] => {
    const { dtoCreate, dtoUpdate, entityType, dtoType } =
        columnTypeDefaultMap[columnType];

    return [
        {
            signature: "TABLE.entity.ts",
            injectable: join(entitiesPath, `${camelCaseName}.entity.ts`),
            additions: [
                decoratorsImports
                    ? {
                          keyword: "*",
                          addition: {
                              base: `${decoratorsImports}\n`,
                              additionIsFile: false,
                          },
                      }
                    : null,
                {
                    keyword: "--- columns ---",
                    addition: {
                        base:
                            `\n${decoratorsValues || ""}` +
                            `\n@Column({\n${
                                entityProperties || ""
                            }\n})\n${columnName}: ${entityType};\n`,
                        additionIsFile: false,
                    },
                },
                {
                    keyword: "{ Entity",
                    addition: { base: ", Column", additionIsFile: false },
                },
            ],
        },
        {
            signature: "create-TABLE.dto.ts",
            injectable: join(dtoPath, `create-${camelCaseName}.dto.ts`),
            additions: [
                {
                    keyword: "*",
                    addition: {
                        base: `${
                            decoratorsImports || ""
                        }\nimport { ApiProperty } from '@nestjs/swagger';\n\n`,
                        additionIsFile: false,
                        conditional: {
                            type: "SUPPOSED_TO_BE_THERE",
                            data: "ApiProperty",
                        },
                    },
                },
                {
                    keyword: "Dto {",
                    addition: {
                        base: `\n${decoratorsValues || ""}\n@ApiProperty({\n${
                            dtoProperties ? dtoProperties + "," : ""
                        }\n${
                            dtoCreate || ""
                        }\n})\n${columnName}: ${dtoType};\n`,
                        additionIsFile: false,
                    },
                },
            ],
        },
        {
            signature: "update-TABLE.dto.ts",
            injectable: join(dtoPath, `update-${camelCaseName}.dto.ts`),
            additions: [
                {
                    keyword: "PartialType",
                    addition: {
                        base: ", ApiProperty ",
                        additionIsFile: false,
                    },
                },
                {
                    keyword: "Dto) {",
                    addition: {
                        base: `\n\n@ApiProperty({ ${
                            dtoUpdate || ""
                        } })\n${columnName}?: ${dtoType};\n`,
                        additionIsFile: false,
                    },
                },
            ],
        },
        {
            signature: "tables-data.enum.ts",
            injectable: join(enumsPath, "tables-data.enum.ts"),
            additions: [
                {
                    keyword: `${upperCaseName}Fields {`,
                    addition: {
                        base: `\n${upperSnakeCaseName} = '${columnName}', `,
                        additionIsFile: false,
                    },
                },
            ],
        },
        {
            signature: "TABLE.service.ts",
            injectable: `${schemasPath}/${pluralLowerCaseName}.service.ts`,
            deletions: [
                {
                    keyword: "CHANGE_THIS_TO_DEFAULT_FIELD",
                    deletion: {
                        conditional: {
                            type: "REPLACED_WITH",
                            data: upperSnakeCaseName,
                        },
                    },
                },
            ],
        },
        ...specialInjections,
    ];
};

export { createColumnInjection };
