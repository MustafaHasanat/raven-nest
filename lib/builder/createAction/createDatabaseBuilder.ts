import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import { pathConvertor } from "../../utils/helpers/filesHelpers.js";
import {
    createDatabaseCloning,
    createDatabaseInjection,
} from "../../commands/createAction/main/createDatabase.js";
import manipulator from "../../manipulator/index.js";
import { MemoValues, QuestionQuery } from "../../types/actions.js";
import { memosToQuestions } from "../../manipulator/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";

/**
 * This function will be fired by the --database option
 */
const createDatabaseBuilder = async (memoValues: MemoValues) => {
    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.createDatabase.rootDir,
                constants.createDatabase.mainDest,
            ] as QuestionQuery[]),
            constants.shared.overwrite([
                "app.module.ts",
                "entities/entities.ts",
                "tables-data.enum.ts",
                ".env",
            ]),
        ])
        .then(async ({ overwrite, rootDir, mainDest }) => {
            await manipulator({
                cloningCommands: createDatabaseCloning(
                    pathConvertor(mainDest, "entities"),
                    pathConvertor(mainDest, "enums")
                ),
                injectionCommands: createDatabaseInjection({
                    appModuleDest: pathConvertor(
                        mainDest,
                        "app.module.ts"
                    ),
                    envLocation: pathConvertor(rootDir, ".env"),
                }),
                memo: {
                    pairs: { rootDir, mainDest },
                    category: MemoCategory.RAVEN_NEST,
                },
                overwrite
            });
        });
};
export default createDatabaseBuilder;
