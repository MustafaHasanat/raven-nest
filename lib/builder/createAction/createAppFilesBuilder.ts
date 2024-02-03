import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import {
    createAppFilesInjection,
    createAppFilesCloning,
} from "../../commands/createAction/main/createAppFiles.js";
import { OptionValues } from "commander";
import manipulator from "../../manipulator/index.js";
import { MemoValues, QuestionQuery } from "../../types/actions.js";
import { memosToQuestions } from "../../manipulator/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";

/**
 * This function will be fired by the --create-app-files option
 */
const createAppFilesBuilder = async (
    memoValues: MemoValues,
    options: OptionValues
) => {
    const {
        auth: isAuth,
        format: isFormat,
        aws: isAWS,
        mailer: isMailer,
    } = options;

    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.createAppFiles.mainDest,
                constants.createAppFiles.projectName,
                constants.createAppFiles.rootDir,
            ] as QuestionQuery[]),
            constants.shared.overwrite([
                "app.module.ts",
                "app.controller.ts",
                "app.service.ts",
                ...(isAuth
                    ? [
                          "user-auth.guard.ts",
                          ".env",
                          "auth.module.ts",
                          "auth.controller.ts",
                          "auth.service.ts",
                          "passwordRequest.hbs",
                          "passwordReset.hbs",
                          "passwordReset.css",
                          "validation.js",
                      ]
                    : []),
                ...(isFormat
                    ? [".prettierrc", ".eslintrc.js", "package.json"]
                    : []),
                ...(isAWS
                    ? ["aws.module.ts", "aws.controller.ts", "aws.service.ts"]
                    : []),
                ...(isMailer ? [] : []),
            ]),
        ])
        .then(async ({ overwrite, mainDest, rootDir, projectName }) => {
            await manipulator({
                cloningCommands: createAppFilesCloning({
                    mainDest,
                    rootDir,
                    isAuth,
                    isFormat,
                    isAWS,
                    isMailer,
                    projectName,
                }),
                injectionCommands: createAppFilesInjection({
                    mainDest,
                    rootDir,
                    isAuth,
                    isFormat,
                    isAWS,
                    isMailer,
                    projectName,
                }),
                memo: {
                    pairs: { mainDest, rootDir, projectName },
                    category: MemoCategory.RAVEN_NEST,
                },
                overwrite,
            });
        });
};

export default createAppFilesBuilder;
