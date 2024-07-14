import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import {
    createMainInjection,
    createMainCloning,
} from "../../commands/create/createMain.js";
import { OptionValues } from "commander";
import manipulator from "../../engines/manipulator.js";
import { MemoValues, QuestionQuery } from "../../types/actions.js";
import { memosToQuestions } from "../../engines/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";
import { pathCreator } from "../../utils/helpers/pathCreator.js";
import { existsSync, writeFileSync } from "fs";

/**
 * This function will be fired by the --create-main option
 */
const createMainBuilder = async (
    memoValues: MemoValues,
    options: OptionValues
) => {
    const { aws: isAWS, mailer: isMailer } = options;

    if (!existsSync(".env")) writeFileSync(".env", "");
    if (!existsSync("public")) pathCreator(["public"]);

    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.createMain.rootDir,
                constants.createMain.mainDest,
                constants.createMain.publicDir,
                constants.createMain.projectName,
            ] as QuestionQuery[]),
            constants.shared.overwrite([
                "main.ts",
                ".env",
                "public/index.html",
                "public/styles/main.css",
                "app.module.ts",
                "app.controller.ts",
                "app.service.ts",
                "user-auth.guard.ts",
                "auth.module.ts",
                "auth.controller.ts",
                "auth.service.ts",
                "passwordRequest.hbs",
                "passwordReset.hbs",
                "passwordReset.css",
                "validation.js",
                ".prettierrc",
                ".eslintrc.js",
                "package.json",
                ...(isAWS
                    ? ["aws.module.ts", "aws.controller.ts", "aws.service.ts"]
                    : []),
                ...(isMailer ? [] : []),
            ]),
        ])
        .then(
            async ({
                overwrite,
                mainDest,
                rootDir,
                projectName,
                publicDir,
            }) => {
                const props = {
                    mainDest,
                    rootDir,
                    isAWS,
                    isMailer,
                    projectName,
                    publicDir,
                };

                await manipulator({
                    actionTag: "create-main",
                    cloningCommands: createMainCloning(props),
                    injectionCommands: createMainInjection(props),
                    memo: {
                        pairs: { mainDest, rootDir, projectName, publicDir },
                        category: MemoCategory.RAVEN_NEST,
                    },
                    overwrite,
                });
            }
        );
};

export default createMainBuilder;