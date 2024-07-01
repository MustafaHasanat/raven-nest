import { ColumnTypeChoice } from "../../enums/createAction.js";
import { CreateColumnProps } from "../../interfaces/builder.js";
import { InjectTemplate } from "../../types/injectTemplate.js";
import { join } from "path";

const createColumnInjection = ({
    columnData: {
        columnName,
        columnType,
        mapsData: { dtoCreate, dtoUpdate, entityType, dtoType },
        entityProperties,
        dtoProperties,
        decorators: { decoratorsValues, decoratorsImports },
        specialInjections,
    },
    paths: { entitiesPath, dtoPath, enumsPath, middlewaresPath },
    tableNameVariants: { camelCaseName, upperCaseName },
    columNameVariants: { upperSnakeCaseName },
}: CreateColumnProps): InjectTemplate[] =>
    [
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
                        base: `import { ApiProperty } from '@nestjs/swagger';\n`,
                        additionIsFile: false,
                        conditional: {
                            type: "SUPPOSED_TO_BE_THERE",
                            data: "ApiProperty",
                        },
                    },
                },
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
                    keyword: "--- Original fields ---",
                    addition: {
                        base: `\n${decoratorsValues || ""}\n@ApiProperty({\n${
                            dtoProperties ? dtoProperties + "," : ""
                        }\n${dtoCreate || ""}\n})\n${columnName}: ${dtoType};\n`,
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
                    keyword: "--- Original fields ---",
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
        ...(columnType !== ColumnTypeChoice.STRING
            ? [
                  {
                      signature: "transformers.ts",
                      injectable: join(middlewaresPath, "transformers.ts"),
                      additions: [
                          {
                              keyword: `TablesNames.${upperSnakeCaseName}) {`,
                              addition: {
                                  base: `\nbody?.${columnName} && (modifiedBody.${columnName} = fieldMap(body?.${columnName}).${columnType});`,
                                  additionIsFile: false,
                                  conditional: {
                                      type: "SUPPOSED_TO_BE_THERE",
                                      data: upperSnakeCaseName,
                                  },
                              },
                          },
                      ],
                  },
              ]
            : []),
        ...specialInjections,
    ] as InjectTemplate[];

export { createColumnInjection };
