import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import { createColumnInjection } from "../../commands/createAction/main/createColumn.js";
import { getColumnAttributes } from "../../utils/helpers/columnHelpers.js";
import { addSpecialItems } from "../../utils/helpers/columnSpecialTypes.js";
import NameVariant from "../../models/nameVariant.js";
import SubPath from "../../models/subPath.js";
import manipulator from "../../manipulator/index.js";
import { MemoValues, QuestionQuery } from "../../types/actions.js";
import {
    MemorizerProps,
    memosToQuestions,
} from "../../manipulator/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";

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
            constants.createColumn.columnProperties,
            constants.createColumn.columnDecorators,
        ])
        .then(
            async ({
                tableName,
                columnName,
                columnType,
                columnProperties,
                columnDecorators,
            }) => {
                // get the names variants and the paths
                const tableNameVariantObj = new NameVariant(tableName);
                const columnNameVariantObj = new NameVariant(columnName);
                const subPathObj = new SubPath({
                    mainDir: mainDest,
                    nameVariant: tableNameVariantObj,
                });

                const isDone = await manipulator({
                    injectionCommands: createColumnInjection({
                        columnData: await addSpecialItems({
                            columnName,
                            columnType: columnType[0],
                            ...getColumnAttributes({
                                columnProperties,
                                columnDecorators,
                            }),
                        }),
                        paths: subPathObj,
                        tableNameVariants: tableNameVariantObj,
                        columNameVariants: columnNameVariantObj,
                    }),
                    memo,
                    overwrite,
                });
                if (!isDone) return;

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
 * This function will be fired by the --create-column option
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
                "tables-data.enum.ts",
                "TABLE.service.ts"
            ]),
        ])
        .then(async ({ mainDest, overwrite }) => {
            await columnBuilder({
                mainDest,
                memo: {
                    pairs: { mainDest },
                    category: MemoCategory.EAGLE_NEST,
                },
                overwrite,
            });
        });
};

export default createColumnBuilder;
