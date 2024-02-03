import { join } from "path";
import { CreateTableProps } from "../../../interfaces/builder.js";
import { InjectTemplate } from "../../../types/injectTemplate.js";
import { CloneTemplate } from "../../../types/cloneTemplate.js";

const createTableCloning = ({
    paths: { entitiesPath, dtoPath, schemasPath },
    nameVariant: {
        camelCaseName,
        upperCaseName,
        pluralLowerCaseName,
        pluralUpperCaseName,
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
            ],
        },
        {
            signature: "TABLE.serviceP.ts",
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
            ],
        },
    ];
};

const createTableInjection = ({
    paths: { entitiesPath, mainPath: appModulePath, enumsPath },
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
                addition: {
                    base: `import { ${upperCaseName} } from "./${camelCaseName}.entity";\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: `import { ${upperCaseName} }`,
                    },
                },
                keyword: "*",
            },
            {
                addition: {
                    base: `\n${upperCaseName},\n`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: upperCaseName,
                    },
                },
                keyword: "entities = [",
            },
        ],
    },
    {
        signature: "app.module.ts",
        injectable: join(appModulePath, "app.module.ts"),
        additions: [
            {
                addition: {
                    base: `import { ${pluralUpperCaseName}Module } from "./schemas/${pluralLowerCaseName}/${pluralLowerCaseName}.module";\n`,
                    additionIsFile: false,
                },
                keyword: "*",
            },
            {
                addition: {
                    base: `\n${pluralUpperCaseName}Module,`,
                    additionIsFile: false,
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
                addition: {
                    base: `export enum ${upperCaseName}Fields {}\n\n`,
                    additionIsFile: false,
                },
                keyword: "*",
            },
            {
                addition: {
                    base: `\n${upperSnakeCaseName} = '${camelCaseName}', `,
                    additionIsFile: false,
                },
                keyword: "TablesNames {",
            },
            {
                addition: {
                    base: `${upperCaseName}Fields | `,
                    additionIsFile: false,
                },
                keyword: "AllTablesColumns = ",
            },
        ],
        deletions: [
            {
                keyword: "| null",
            },
        ],
    },
];

export { createTableInjection, createTableCloning };
