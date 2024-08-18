/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectTemplate } from "engine";
import { CreateColumnProps } from "../../interfaces/builder.js";
import { join } from "path";
import { ColumnTypeChoice } from "../../enums/createAction.js";

const deletions = [
    {
        keyword: "// --- decorators ---",
        deletion: {
            isWholeLine: true,
            conditional: {
                type: "REPLACED_WITH",
                data: "",
                special: "INDEX_CUT",
            },
        },
    },
];

const createColumnInjection = ({
    columnAdditions: {
        entityAdditions,
        createDtoAdditions,
        updateDtoAdditions,
    },
    paths: { entitiesPath, dtoPath, enumsPath, pipesPath },
    tableNameVariants,
    columNameVariants,
    columnType,
}: CreateColumnProps): InjectTemplate[] =>
    [
        {
            signature: "TABLE.entity.ts",
            injectable: join(
                entitiesPath,
                `${tableNameVariants.camelCaseName}.entity.ts`
            ),
            additions: entityAdditions,
            deletions,
        },
        {
            signature: "create-TABLE.dto.ts",
            injectable: join(
                dtoPath,
                `create-${tableNameVariants.camelCaseName}.dto.ts`
            ),
            additions: createDtoAdditions,
            deletions,
        },
        {
            signature: "update-TABLE.dto.ts",
            injectable: join(
                dtoPath,
                `update-${tableNameVariants.camelCaseName}.dto.ts`
            ),
            additions: updateDtoAdditions,
        },
        {
            signature: "tables.enum.ts",
            injectable: join(enumsPath, "tables.enum.ts"),
            additions: [
                {
                    keyword: `${tableNameVariants.upperCaseName}Fields {`,
                    addition: {
                        base: `\n${columNameVariants.upperSnakeCaseName} = "${columNameVariants.camelCaseName}",\n`,
                        additionIsFile: false,
                        conditional: {
                            type: "SUPPOSED_TO_BE_THERE",
                            data: `${columNameVariants.upperSnakeCaseName} = "${columNameVariants.camelCaseName}"`,
                        },
                    },
                },
            ],
        },
        {
            signature: "post_patch.pipe.ts",
            injectable: join(pipesPath, "post_patch.pipe.ts"),
            additions: [
                ColumnTypeChoice.BOOLEAN,
                ColumnTypeChoice.DATE,
                ColumnTypeChoice.NUMBER,
            ].includes(columnType)
                ? [
                      {
                          keyword: `${tableNameVariants.camelCaseName}: {`,
                          addition: {
                              base: `${columNameVariants.camelCaseName}: "${columnType}",`,
                              additionIsFile: false,
                          },
                      },
                  ]
                : [],
        },
    ] as InjectTemplate[];

export { createColumnInjection };
