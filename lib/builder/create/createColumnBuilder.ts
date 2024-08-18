/* eslint-disable @typescript-eslint/no-unused-vars */
import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import { createColumnInjection } from "../../commands/create/createColumn.js";
import NameVariant from "../../models/nameVariant.js";
import SubPath from "../../models/subPath.js";
import manipulator from "../../engines/manipulator.js";
import { MemoValues, QuestionQuery } from "actions";
import {
    memorizeColumn,
    MemorizerProps,
    memosToQuestions,
} from "../../engines/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";
import {
    ColumnTypeChoice,
    ColumnDecoratorChoice,
    ColumnPropertyChoice,
} from "../../enums/createAction.js";
import getEntityAdditions from "../../utils/helpers/columnHelpers/getEntityAdditions.js";
import getCreateDtoAdditions from "../../utils/helpers/columnHelpers/getCreateDtoAdditions.js";
import getUpdateDtoAdditions from "../../utils/helpers/columnHelpers/getUpdateDtoAdditions.js";
import { CloneTemplate } from "engine";
import { join } from "path";

interface ColumnPromptValues {
    tableName: string;
    columnName: string;
    description: string;
    example: string;
    defaultValue: string;
    columnType: ColumnTypeChoice[];
    columnProperties: ColumnPropertyChoice[];
    columnDecorators: ColumnDecoratorChoice[];
}

const columnBuilder = async ({
    mainDest,
    prevTableName = "",
    memo,
    overwrite,
}: {
    mainDest: string;
    prevTableName?: string;
    memo: MemorizerProps;
    overwrite: string[];
}) => {
    await inquirer
        .prompt([
            { ...constants.createColumn.tableName, default: prevTableName },
            constants.createColumn.columnName,
            constants.createColumn.columnType,
            constants.createColumn.description,
            constants.createColumn.example,
            constants.createColumn.defaultValue,
            constants.createColumn.columnProperties,
            constants.createColumn.columnDecorators,
        ])
        .then(
            async ({
                tableName,
                columnName,
                description,
                example,
                defaultValue,
                columnType,
                columnProperties,
                columnDecorators,
            }: ColumnPromptValues) => {
                // get the names variants and the paths
                const tableNameVariantObj = new NameVariant(tableName);
                const columnNameVariantObj = new NameVariant(columnName);
                const subPathObj = new SubPath({
                    mainDir: mainDest,
                    nameVariant: tableNameVariantObj,
                });

                const cloningCommands: CloneTemplate[] = [];
                const specialReplacements: any[] = [];

                // handle the "Length" decorator
                if (columnDecorators.includes(ColumnDecoratorChoice.LENGTH))
                    await inquirer
                        .prompt([constants.createColumn.stringLength])
                        .then(async ({ stringLength }) => {
                            const [minimum, maximum] = stringLength
                                .trim()
                                .split(",");
                            specialReplacements.push(
                                {
                                    oldString: "MIN_LENGTH",
                                    newString: minimum,
                                },
                                {
                                    oldString: "MAX_LENGTH",
                                    newString: maximum,
                                }
                            );
                        });

                // handle the "ENUM" decorator
                if (columnProperties.includes(ColumnPropertyChoice.ENUM))
                    await inquirer
                        .prompt([
                            constants.createColumn.enumName,
                            constants.createColumn.enumValues,
                        ])
                        .then(async ({ enumName, enumValues }) => {
                            specialReplacements.push({
                                oldString: "ENUM_OBJECT",
                                newString: enumName,
                            });
                            columnDecorators.push(
                                "isEnum" as ColumnDecoratorChoice
                            );

                            cloningCommands.push({
                                signature: "new-enum.enum.ts",
                                target: "base/typescript/enum/file-enum.txt",
                                destination: join(subPathObj.enumsPath),
                                newFileName: `${tableNameVariantObj.camelCaseName}-${columnNameVariantObj.camelCaseName}-${enumName}.enum.ts`,
                                replacements: [
                                    {
                                        oldString: "ENUM_NAME",
                                        newString: enumName,
                                    },
                                    {
                                        oldString: "ENUM_VALUE_PLACEHOLDER",
                                        newString: (enumValues as string)
                                            .split(",")
                                            .map((item) => {
                                                const itemVariant =
                                                    new NameVariant(item);
                                                return `${itemVariant.upperSnakeCaseName} = '${itemVariant.camelCaseName}'`;
                                            })
                                            .join(","),
                                    },
                                ],
                            });
                        });

                const props = {
                    tableNameVariants: tableNameVariantObj,
                    columNameVariants: columnNameVariantObj,
                    columnType: columnType[0],
                    description,
                    example,
                    defaultValue,
                    columnProperties,
                    columnDecorators,
                    specialReplacements,
                };

                // TODO: add the import statement for the new enum to each one of those 
                const entityAdditions = await getEntityAdditions(props);
                const createDtoAdditions = await getCreateDtoAdditions(props);
                const updateDtoAdditions = await getUpdateDtoAdditions(props);

                const { cloning, injection } = await manipulator({
                    actionTag: "create-column",
                    cloningCommands,
                    injectionCommands: createColumnInjection({
                        columnAdditions: {
                            entityAdditions,
                            createDtoAdditions,
                            updateDtoAdditions,
                        },
                        paths: subPathObj,
                        tableNameVariants: tableNameVariantObj,
                        columNameVariants: columnNameVariantObj,
                        columnType: columnType[0],
                    }),
                    memo,
                    overwrite,
                });
                if (!cloning || !injection) return;

                await memorizeColumn({
                    category: MemoCategory.RAVEN_NEST,
                    tableName,
                    columnName,
                });

                // ask the user if they want to add another column
                await inquirer
                    .prompt([constants.createColumn.newColumn])
                    .then(async ({ newColumn }) => {
                        if (newColumn)
                            await columnBuilder({
                                mainDest,
                                prevTableName: tableName,
                                memo,
                                overwrite,
                            });
                    });
            }
        );
};

/**
 * This function will be fired by the "create column" command
 */
const createColumnBuilder = async (memoValues: MemoValues) => {
    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.createColumn.mainDest,
            ] as QuestionQuery[]),
            constants.shared.overwrite([
                "TABLE.entity.ts",
                "create-TABLE.dto.ts",
                "update-TABLE.dto.ts",
                "tables.enum.ts",
                "TABLE.service.ts",
                "new-enum.enum.ts",
            ]),
        ])
        .then(async ({ mainDest, overwrite }) => {
            await columnBuilder({
                mainDest,
                memo: {
                    pairs: { mainDest },
                    category: MemoCategory.RAVEN_NEST,
                },
                overwrite,
            });
        });
};

export default createColumnBuilder;
