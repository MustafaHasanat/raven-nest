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

interface ColumnPromptValues {
    tableName: string;
    columnName: string;
    description: string;
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
            constants.createColumn.defaultValue,
            constants.createColumn.columnProperties,
            constants.createColumn.columnDecorators,
        ])
        .then(
            async ({
                tableName,
                columnName,
                description,
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

                const props = {
                    tableNameVariants: tableNameVariantObj,
                    columNameVariants: columnNameVariantObj,
                    columnType,
                    description,
                    defaultValue,
                    columnProperties,
                    columnDecorators,
                };

                const entityAdditions = await getEntityAdditions(props);
                const createDtoAdditions = await getCreateDtoAdditions(props);
                const updateDtoAdditions = await getUpdateDtoAdditions(props);

                const { cloning, injection } = await manipulator({
                    actionTag: "create-column",
                    injectionCommands: createColumnInjection({
                        columnAdditions: {
                            entityAdditions,
                            createDtoAdditions,
                            updateDtoAdditions,
                        },
                        paths: subPathObj,
                        tableNameVariants: tableNameVariantObj,
                        columNameVariants: columnNameVariantObj,
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
