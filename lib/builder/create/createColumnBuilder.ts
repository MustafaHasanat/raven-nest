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
import { ConfigCategory } from "../../enums/actions.js";
import {
    ColumnTypeChoice,
    ColumnDecoratorChoice,
    ColumnPropertyChoice,
} from "../../enums/createAction.js";
import getEntityAdditions from "../../utils/helpers/columnHelpers/getEntityAdditions.js";
import getCreateDtoAdditions from "../../utils/helpers/columnHelpers/getCreateDtoAdditions.js";
import getUpdateDtoAdditions from "../../utils/helpers/columnHelpers/getUpdateDtoAdditions.js";
import { CloneTemplate } from "engine";
import {
    enumDecoratorHandler,
    lengthDecoratorHandler,
} from "../../utils/helpers/columnHelpers/specialInquirers.js";
import { SpecialChunks } from "../../interfaces/builder.js";
import { debuggerLog } from "../../utils/helpers/logHelpers.js";

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
                const specialChunks: SpecialChunks = {};

                // handle the "Length" decorator
                if (columnDecorators.includes(ColumnDecoratorChoice.LENGTH)) {
                    const replacements = await lengthDecoratorHandler();
                    specialReplacements.push(replacements);
                }

                // handle the "ENUM" decorator
                if (columnProperties.includes(ColumnPropertyChoice.ENUM)) {
                    const { commands, decorators, replacements, enumInfo } =
                        await enumDecoratorHandler({
                            subPathObj,
                            tableNameVariantObj,
                            columnNameVariantObj,
                        });

                    specialReplacements.push(replacements);
                    columnDecorators.push(...decorators);
                    cloningCommands.push(...commands);

                    specialChunks["enumInfo"] = enumInfo;
                }

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
                    specialChunks,
                };

                await debuggerLog({
                    messages: {
                        cloningCommands,
                        specialReplacements,
                        specialChunks,
                        props,
                    },
                });

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
                    category: ConfigCategory.RAVEN_NEST,
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
                    category: ConfigCategory.RAVEN_NEST,
                },
                overwrite,
            });
        });
};

export default createColumnBuilder;
