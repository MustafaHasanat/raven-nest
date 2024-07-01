import { join } from "path";
import { CreateTableProps } from "../../interfaces/builder.js";
import { InjectTemplate } from "../../types/injectTemplate.js";
import { CloneTemplate } from "../../types/cloneTemplate.js";

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
        middlewaresPath,
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
                keyword: "// ===== tables =====",
            },
        ],
    },
    {
        signature: "tables-data.enum.ts",
        injectable: join(enumsPath, "tables-data.enum.ts"),
        additions: [
            {
                keyword: "AllTablesColumns =",
                addition: {
                    base: ` | ${upperCaseName}Fields`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `${upperCaseName}Fields`,
                    },
                },
            },
            {
                addition: {
                    base: `export enum ${upperCaseName}Fields {}\n\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `export enum ${upperCaseName}Fields`,
                    },
                },
                keyword: "*",
            },
            {
                addition: {
                    base: `\n${upperSnakeCaseName} = '${camelCaseName}', `,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `${upperSnakeCaseName} = '${camelCaseName}'`,
                    },
                },
                keyword: "TablesNames {",
            },
        ],
        deletions: [
            {
                keyword: `| null`,
                deletion: {
                    mayNotBeThere: true,
                    onlyFirstOccurrence: true,
                },
            },
        ],
    },
    {
        signature: "transformers.ts",
        injectable: join(middlewaresPath, "transformers.ts"),
        additions: [
            {
                keyword: "// ----- tables' transformers -----",
                addition: {
                    base: `\nif (table === TablesNames.${upperSnakeCaseName}) {}\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `.${upperSnakeCaseName})`,
                    },
                },
            },
        ],
    },
];

export { createTableInjection, createTableCloning };
