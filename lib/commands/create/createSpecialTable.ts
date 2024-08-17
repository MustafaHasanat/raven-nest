/* eslint-disable no-empty-pattern */
import { CreateTableProps } from "../../interfaces/builder.js";
import { CreateSpecialArgument } from "../../enums/actions.js";
import { join } from "path";
import { SpecialTableType } from "../../enums/createAction.js";
import { CloneTemplate, InjectTemplate } from "engine";

const createSpecialTableCloning = ({
    nameVariant: { camelCaseName, pluralLowerCaseName },
    paths: { entitiesPath, dtoPath, schemasPath },
    tableName,
}: CreateTableProps & {
    tableName: CreateSpecialArgument;
}): CloneTemplate[] => {
    const sharedClones = (specialType: SpecialTableType): CloneTemplate[] => [
        {
            signature: "TABLE.entity.ts",
            target: `base/typescript/table/${specialType}/entity.txt`,
            destination: entitiesPath,
            newFileName: camelCaseName + ".entity.ts",
        },
        {
            signature: "create-TABLE-dto.ts",
            target: `base/typescript/table/${specialType}/createDto.txt`,
            destination: dtoPath,
            newFileName: `create-${camelCaseName}.dto.ts`,
        },
        {
            signature: "update-TABLE-dto.ts",
            target: `base/typescript/table/${specialType}/updateDto.txt`,
            destination: dtoPath,
            newFileName: `update-${camelCaseName}.dto.ts`,
        },
        {
            signature: "TABLE.module.ts",
            target: `base/typescript/table/${specialType}/module.txt`,
            destination: schemasPath,
            newFileName: `${pluralLowerCaseName}.module.ts`,
        },
        {
            signature: "TABLE.controller.ts",
            target: `base/typescript/table/${specialType}/controller.txt`,
            destination: schemasPath,
            newFileName: `${pluralLowerCaseName}.controller.ts`,
        },
        {
            signature: "TABLE.service.ts",
            target: `base/typescript/table/${specialType}/service.txt`,
            destination: schemasPath,
            newFileName: `${pluralLowerCaseName}.service.ts`,
        },
    ];

    if (tableName === CreateSpecialArgument.PRODUCT)
        return sharedClones(SpecialTableType.PRODUCT);
    else if (tableName === CreateSpecialArgument.NOTIFICATION)
        return sharedClones(SpecialTableType.NOTIFICATION);
    else return [];
};

const createSpecialTableInjection = ({
    nameVariant: {
        camelCaseName,
        upperCaseName,
        pluralName,
        pluralUpperCaseName,
        pluralLowerCaseName,
        pluralUpperSnakeCaseName,
    },
    paths: { mainPath, enumsPath, entitiesPath },
    tableName,
}: CreateTableProps & {
    tableName: CreateSpecialArgument;
}): InjectTemplate[] => {
    const sharedInjects = (specialType: SpecialTableType): InjectTemplate[] => [
        {
            signature: "app.module.ts",
            injectable: join(mainPath, "app.module.ts"),
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
            signature: "entities/entities.ts",
            injectable: join(entitiesPath, "entities.ts"),
            additions: [
                {
                    addition: {
                        base: `import { ${upperCaseName} } from "./${camelCaseName}.entity";\n\n`,
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
                            data: `${upperCaseName},`,
                        },
                    },
                    keyword: "entities = [",
                },
            ],
        },
        {
            signature: "tables.enum.ts",
            injectable: join(enumsPath, "tables.enum.ts"),
            additions: [
                {
                    addition: {
                        base: `base/typescript/table/${specialType}/fields-enum.txt`,
                    },
                    keyword: "*",
                },
                {
                    addition: {
                        base: `\n${pluralUpperSnakeCaseName} = '${pluralName}', `,
                        additionIsFile: false,
                    },
                    keyword: "TablesNames {",
                },
                {
                    addition: {
                        base: `${upperCaseName}Fields | `,
                        additionIsFile: false,
                    },
                    keyword: "AllTablesColumns =",
                },
            ],
            deletions: [
                {
                    keyword: "| null",
                },
            ],
        },
    ];

    if (tableName === CreateSpecialArgument.PRODUCT)
        return sharedInjects(SpecialTableType.PRODUCT);
    else if (tableName === CreateSpecialArgument.NOTIFICATION)
        return sharedInjects(SpecialTableType.NOTIFICATION);
    else return [];
};
export { createSpecialTableCloning, createSpecialTableInjection };
