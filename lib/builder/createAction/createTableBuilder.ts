import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import {
    createTableInjection,
    createTableCloning,
} from "../../commands/createAction/main/createTable.js";
import {
    createSpecialTableCloning,
    createSpecialTableInjection,
} from "../../commands/createAction/options/createSpecialTable.js";
import { OptionValues } from "commander";
import NameVariant from "../../models/nameVariant.js";
import SubPath from "../../models/subPath.js";
import { CreateSpecialArgument } from "../../enums/actions.js";
import manipulator from "../../manipulator/index.js";
import { MemoValues, QuestionQuery } from "../../types/actions.js";
import { memosToQuestions } from "../../manipulator/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";

/**
 * This function will be fired by the --create-table option
 */
const createTableBuilder = async (
    memoValues: MemoValues,
    options: OptionValues
) => {
    const { special } = options;
    let isSpecialTable = !!special;

    const questions = [
        ...memosToQuestions(memoValues, [
            constants.createTable.mainDest,
        ] as QuestionQuery[]),
        constants.shared.overwrite([
            "app.module.ts",
            "tables-data.enum.ts",
            "entities/entities.ts",
            "TABLE.entity.ts",
            "create-TABLE-dto.ts",
            "update-TABLE-dto.ts",
            "TABLE.module.ts",
            "TABLE.controller.ts",
            "TABLE.service.ts",
            "TABLE-fields.enum.ts",
            ...(isSpecialTable && special === "user"
                ? [
                      "login-user.dto.ts",
                      "users.enum.ts",
                      "token-payload.type.ts",
                  ]
                : []),
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
            };

            await manipulator({
                cloningCommands: isSpecialTable
                    ? createSpecialTableCloning({
                          ...createTableObj,
                          tableName: special || tableName,
                      })
                    : createTableCloning(createTableObj),
                injectionCommands: isSpecialTable
                    ? createSpecialTableInjection({
                          ...createTableObj,
                          tableName: special || tableName,
                      })
                    : createTableInjection(createTableObj),
                memo: {
                    pairs: { mainDest },
                    category: MemoCategory.EAGLE_NEST,
                },
                overwrite,
            });
        });
};

export default createTableBuilder;
