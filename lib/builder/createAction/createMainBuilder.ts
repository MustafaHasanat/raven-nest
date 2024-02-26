import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import {
    createMainCloning,
    createMainInjection,
} from "../../commands/createAction/main/createMain.js";
import manipulator from "../../manipulator/index.js";
import { MemoValues, QuestionQuery } from "../../types/actions.js";
import { memosToQuestions } from "../../manipulator/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";
import { existsSync, writeFileSync } from "fs";

/**
 * This function will be fired by the --create-main option
 */
const createMainBuilder = async (memoValues: MemoValues) => {
    if (!existsSync(".env")) writeFileSync(".env", "");

    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.createMain.projectName,
                constants.createMain.mainDest,
            ] as QuestionQuery[]),
            constants.shared.overwrite(["main.ts", ".env"]),
        ])
        .then(async ({ mainDest, projectName, overwrite }) => {
            await manipulator({
                actionTag: "create-main",
                cloningCommands: createMainCloning(mainDest, projectName),
                injectionCommands: createMainInjection(".env"),
                memo: {
                    pairs: { mainDest, projectName },
                    category: MemoCategory.RAVEN_NEST,
                },
                overwrite,
            });
        });
};

export default createMainBuilder;
