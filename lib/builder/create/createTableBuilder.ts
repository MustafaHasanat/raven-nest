import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import {
    createTableInjection,
    createTableCloning,
} from "../../commands/create/createTable.js";
import {
    createSpecialTableCloning,
    createSpecialTableInjection,
} from "../../commands/create/createSpecialTable.js";
import NameVariant from "../../models/nameVariant.js";
import SubPath from "../../models/subPath.js";
import { CreateSpecialArgument } from "../../enums/actions.js";
import manipulator from "../../engines/manipulator.js";
import { MemoValues, QuestionQuery } from "actions";
import { memorizeTable, memosToQuestions } from "../../engines/memorizer.js";
import { ConfigCategory } from "../../enums/actions.js";
import { AppOptions } from "app";

/**
 * This function will be fired by the --create-table option
 */
const createTableBuilder = async (
    memoValues: MemoValues,
    options: AppOptions
) => {
    const { special } = options;
    let isSpecialTable = !!special;

    const questions = [
        ...memosToQuestions(memoValues, [
            constants.createTable.mainDest,
        ] as QuestionQuery[]),
        constants.shared.overwrite([
            "app.module.ts",
            "tables.enum.ts",
            "entities/entities.ts",
            "TABLE.entity.ts",
            "entities/index.ts",
            "create-TABLE-dto.ts",
            "update-TABLE-dto.ts",
            "TABLE.module.ts",
            "TABLE.controller.ts",
            "TABLE.service.ts",
            "TABLE-fields.enum.ts",
            "relations.ts",
            "relations.ts",
            "post_patch.pipe.ts",
        ]),
    ];

    // ask about the table name if the '--special' option is not present
    if (!isSpecialTable) questions.unshift(constants.createTable.tableName);

    await inquirer
        .prompt(questions)
        .then(async ({ overwrite, tableName, mainDest }) => {
            // if the user entered a special table name,
            // ask them if they want to proceed as if '--special' is active
            if (
                !isSpecialTable &&
                Object.values(CreateSpecialArgument).includes(tableName)
            ) {
                const { isSpecial } = await inquirer.prompt([
                    constants.createTable.isSpecial(tableName),
                ]);

                if (isSpecial) isSpecialTable = true;
            }
            // get the names variants and the paths
            const nameVariantObj = new NameVariant(special || tableName);
            const subPathObj = new SubPath({
                mainDir: mainDest,
                nameVariant: nameVariantObj,
            });
            const createTableObj = {
                paths: subPathObj,
                nameVariant: nameVariantObj,
                tableName: special || tableName,
            };

            const { cloning, injection } = await manipulator({
                actionTag: "create-table",
                cloningCommands: isSpecialTable
                    ? createSpecialTableCloning(createTableObj)
                    : createTableCloning(createTableObj),
                injectionCommands: isSpecialTable
                    ? createSpecialTableInjection(createTableObj)
                    : createTableInjection(createTableObj),
                memo: {
                    pairs: { mainDest },
                    category: ConfigCategory.RAVEN_NEST,
                },
                overwrite,
            });
            if (!cloning || !injection) return;

            await memorizeTable({
                category: ConfigCategory.RAVEN_NEST,
                tableName,
            });
        });
};

export default createTableBuilder;
