import { join } from "path";
import { CreateTableProps } from "../../interfaces/builder.js";
import { CloneTemplate, InjectTemplate } from "engine";

const createTableCloning = ({
    paths: { entitiesPath, dtoPath, schemasPath },
    nameVariant: {
        camelCaseName,
        upperCaseName,
        pluralLowerCaseName,
        pluralUpperCaseName,
        upperSnakeCaseName,
        lowerSnakeCaseName,
    },
}: CreateTableProps): CloneTemplate[] => {
    return [
        {
            signature: "TABLE.entity.ts",
            target: "base/typescript/db/entity.txt",
            destination: entitiesPath,
            newFileName: camelCaseName + ".entity.ts",
            replacements: [
                {
                    oldString: "TABLE_UPPER_NAME",
                    newString: upperCaseName,
                },
            ],
        },
        {
            signature: "create-TABLE-dto.ts",
            target: "base/typescript/dto/create-dto.txt",
            destination: dtoPath,
            newFileName: `create-${camelCaseName}.dto.ts`,
            replacements: [
                {
                    oldString: "TABLE_UPPER_NAME",
                    newString: upperCaseName,
                },
            ],
        },
        {
            signature: "update-TABLE-dto.ts",
            target: "base/typescript/dto/update-dto.txt",
            destination: dtoPath,
            newFileName: `update-${camelCaseName}.dto.ts`,
            replacements: [
                {
                    oldString: "TABLE_UPPER_NAME",
                    newString: upperCaseName,
                },
                {
                    oldString: "TABLE_LOWER_NAME",
                    newString: camelCaseName,
                },
            ],
        },
        {
            signature: "TABLE.module.ts",
            target: "base/typescript/table/module-file.txt",
            destination: schemasPath,
            newFileName: `${pluralLowerCaseName}.module.ts`,
            replacements: [
                {
                    oldString: "TABLE_LOWER_NAME",
                    newString: camelCaseName,
                },
                {
                    oldString: "TABLE_UPPER_NAME",
                    newString: upperCaseName,
                },
                {
                    oldString: "TABLE_PLURAL_UPPER_NAME",
                    newString: pluralUpperCaseName,
                },
                {
                    oldString: "TABLE_PLURAL_LOWER_NAME",
                    newString: pluralLowerCaseName,
                },
            ],
        },
        {
            signature: "TABLE.controller.ts",
            target: "base/typescript/table/controller-file.txt",
            destination: schemasPath,
            newFileName: `${pluralLowerCaseName}.controller.ts`,
            replacements: [
                {
                    oldString: "TABLE_UPPER_NAME",
                    newString: upperCaseName,
                },
                {
                    oldString: "TABLE_LOWER_NAME",
                    newString: camelCaseName,
                },
                {
                    oldString: "TABLE_PLURAL_UPPER_NAME",
                    newString: pluralUpperCaseName,
                },
                {
                    oldString: "TABLE_PLURAL_LOWER_NAME",
                    newString: pluralLowerCaseName,
                },
                {
                    oldString: "TABLE_UPPER_SNAKE_CASE_NAME",
                    newString: upperSnakeCaseName,
                },
            ],
        },
        {
            signature: "TABLE.service.ts",
            target: "base/typescript/table/service-file.txt",
            destination: schemasPath,
            newFileName: `${pluralLowerCaseName}.service.ts`,
            replacements: [
                {
                    oldString: "TABLE_UPPER_NAME",
                    newString: upperCaseName,
                },
                {
                    oldString: "TABLE_LOWER_NAME",
                    newString: camelCaseName,
                },
                {
                    oldString: "TABLE_PLURAL_UPPER_NAME",
                    newString: pluralUpperCaseName,
                },
                {
                    oldString: "TABLE_PLURAL_LOWER_NAME",
                    newString: pluralLowerCaseName,
                },
                {
                    oldString: "TABLE_LOWER_SNAKE_CASE_NAME",
                    newString: lowerSnakeCaseName,
                },
            ],
        },
    ];
};

const createTableInjection = ({
    paths: {
        entitiesPath,
        mainPath: appModulePath,
        enumsPath,
        constantsPath,
        pipesPath,
    },
    nameVariant: {
        camelCaseName,
        upperCaseName,
        pluralUpperCaseName,
        pluralLowerCaseName,
        upperSnakeCaseName,
    },
}: CreateTableProps): InjectTemplate[] => [
    {
        signature: "entities/entities.ts",
        injectable: join(entitiesPath, "entities.ts"),
        additions: [
            {
                keyword: "entities = [",
                addition: {
                    base: `\n${upperCaseName},\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: upperCaseName + ",",
                    },
                },
            },
            {
                keyword: "*",
                addition: {
                    base: `import { ${upperCaseName} } from "./${camelCaseName}.entity";\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `import { ${upperCaseName} } from "./${camelCaseName}.entity"`,
                    },
                },
            },
        ],
    },
    {
        signature: "entities/index.ts",
        injectable: join(entitiesPath, "index.ts"),
        additions: [
            {
                keyword: "*",
                addition: {
                    base: `export { ${upperCaseName} } from "./${camelCaseName}.entity";\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: upperCaseName,
                    },
                },
            },
        ],
    },
    {
        signature: "app.module.ts",
        injectable: join(appModulePath, "app.module.ts"),
        additions: [
            {
                keyword: "*",
                addition: {
                    base: `import { ${pluralUpperCaseName}Module } from "./schemas/${pluralLowerCaseName}/${pluralLowerCaseName}.module";\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `import { ${pluralUpperCaseName}Module`,
                    },
                },
            },
            {
                addition: {
                    base: `\n${pluralUpperCaseName}Module,`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `${pluralUpperCaseName}Module,`,
                    },
                },
                keyword: "// --- app tables ---",
            },
        ],
    },
    {
        signature: "tables.enum.ts",
        injectable: join(enumsPath, "tables.enum.ts"),
        additions: [
            {
                keyword: "AllTablesColumns =",
                addition: {
                    base: ` ${upperCaseName}Fields`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `${upperCaseName}Fields`,
                    },
                },
            },
            {
                addition: {
                    base: `export enum ${upperCaseName}Fields {
                            ID = "id",
                            CREATED_AT = "createdAt",
                            UPDATED_AT = "updatedAt",
                        }\n\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `export enum ${upperCaseName}Fields`,
                    },
                },
                keyword: "*",
            },
            {
                keyword: "TablesNames {",
                addition: {
                    base: `\n${upperSnakeCaseName} = '${camelCaseName}', `,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `${upperSnakeCaseName} =`,
                    },
                },
            },
        ],
    },
    {
        signature: "relations.ts",
        injectable: join(constantsPath, "relations.ts"),
        additions: [
            {
                keyword: "Tables<T> = {",
                addition: {
                    base: `${camelCaseName}: T;`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `${camelCaseName}: T`,
                    },
                },
            },
            {
                keyword: "RELATIONS: Tables<RelationsListing> = {",
                addition: {
                    base: `
                     ${camelCaseName}: {
                            oneToOne: [],
                            oneToMany: [],
                            manyToOne: [],
                            manyToMany: [],
                        },`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `${camelCaseName}: {`,
                    },
                },
            },
            {
                keyword: "// --- app relations ---",
                addition: {
                    base: `
                    ${camelCaseName}: {
                            descendants: [
                                ...RELATIONS.${camelCaseName}.oneToMany,
                                ...RELATIONS.${camelCaseName}.manyToOne,
                                ...RELATIONS.${camelCaseName}.manyToMany,
                            ],
                            ascendants: [
                                ...RELATIONS.${camelCaseName}.manyToOne, 
                                ...RELATIONS.${camelCaseName}.manyToMany
                            ],
                        },`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `RELATIONS.${camelCaseName}.oneToMany`,
                    },
                },
            },
        ],
    },
    {
        signature: "post_patch.pipe.ts",
        injectable: join(pipesPath, "post_patch.pipe.ts"),
        additions: [
            {
                keyword: "NewInstanceTransformer } = {",
                addition: {
                    base: `${camelCaseName}: {},`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `${camelCaseName}: {`,
                    },
                },
            },
        ],
    },
];

export { createTableInjection, createTableCloning };
