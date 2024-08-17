/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectTemplate } from "engine";
import { CreateColumnProps } from "../../interfaces/builder.js";
import { join } from "path";

const createColumnInjection = ({
    columnAdditions: {
        entityAdditions,
        createDtoAdditions,
        updateDtoAdditions,
    },
    paths: { entitiesPath, dtoPath, enumsPath, pipesPath },
    tableNameVariants,
    columNameVariants,
}: CreateColumnProps): InjectTemplate[] =>
    [
        {
            signature: "TABLE.entity.ts",
            injectable: join(
                entitiesPath,
                `${tableNameVariants.camelCaseName}.entity.ts`
            ),
            additions: entityAdditions,
            deletions: [
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
            ],
        },
        {
            signature: "create-TABLE.dto.ts",
            injectable: join(
                dtoPath,
                `create-${tableNameVariants.camelCaseName}.dto.ts`
            ),
            additions: createDtoAdditions,
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
                        base: `\n${columNameVariants.upperSnakeCaseName} = '${columNameVariants.camelCaseName}',\n`,
                        additionIsFile: false,
                        conditional: {
                            type: "SUPPOSED_TO_BE_THERE",
                            data: `${tableNameVariants.upperCaseName}Fields`,
                        },
                    },
                },
            ],
        },
        {
            signature: "post_patch.pipe.ts",
            injectable: join(pipesPath, "post_patch.pipe.ts"),
            additions: [],
        },
    ] as InjectTemplate[];

export { createColumnInjection };
