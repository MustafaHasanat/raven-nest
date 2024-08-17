import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import { createRelationInjection } from "../../commands/create/createRelation.js";
import NameVariant from "../../models/nameVariant.js";
import SubPath from "../../models/subPath.js";
import manipulator from "../../engines/manipulator.js";
import { MemoValues, QuestionQuery } from "actions";
import {
    MemorizerProps,
    memosToQuestions,
} from "../../engines/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";

const relationBuilder = async ({
    mainDest,
    memo,
    overwrite,
}: {
    mainDest: string;
    memo: MemorizerProps;
    overwrite: string[];
}) => {
    await inquirer
        .prompt([
            constants.createRelation.relationType,
            constants.createRelation.tables,
        ])
        .then(async ({ tables, relationType }) => {
            const [firstTableName, secondTableName] = tables.split("-");

            // get the names variants and the paths
            const tableNameVariantObj1 = new NameVariant(firstTableName);
            const tableNameVariantObj2 = new NameVariant(secondTableName);
            const subPathObj1 = new SubPath({
                mainDir: mainDest,
                nameVariant: tableNameVariantObj1,
            });
            const subPathObj2 = new SubPath({
                mainDir: mainDest,
                nameVariant: tableNameVariantObj2,
            });

            const isDone = await manipulator({
                actionTag: "create-relation",
                injectionCommands: createRelationInjection({
                    relationType: relationType[0],
                    table1: {
                        nameVariant: tableNameVariantObj1,
                        paths: subPathObj1,
                    },
                    table2: {
                        nameVariant: tableNameVariantObj2,
                        paths: subPathObj2,
                    },
                }),
                memo,
                overwrite,
            });
            if (!isDone) return;

            // ask the user if they want to add another relation
            await inquirer
                .prompt([constants.createRelation.newRelation])
                .then(async ({ newRelation }) => {
                    if (newRelation)
                        await relationBuilder({ mainDest, memo, overwrite });
                });
        });
};

/**
 * This function will be fired by the --create-relation option
 */
const createRelationBuilder = async (memoValues: MemoValues) => {
    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.createRelation.mainDest,
            ] as QuestionQuery[]),
            constants.shared.overwrite([
                "TABLE1.entity.ts",
                "TABLE1.service.ts",
                "TABLE1.controller.ts",
                "TABLE2.entity.ts",
                "TABLE2.module.ts",
                "TABLE2.service.ts",
                "TABLE2.controller.ts",
                "create-TABLE2.dto.ts",
                "update-TABLE2.dto.ts",
            ]),
        ])
        .then(async ({ overwrite, mainDest }) => {
            await relationBuilder({
                mainDest,
                memo: {
                    pairs: { mainDest },
                    category: MemoCategory.RAVEN_NEST,
                },
                overwrite,
            });
        });
};

export default createRelationBuilder;
