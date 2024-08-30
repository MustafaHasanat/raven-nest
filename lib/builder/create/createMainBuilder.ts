import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import {
    createMainInjection,
    createMainCloning,
} from "../../commands/create/createMain.js";
import manipulator from "../../engines/manipulator.js";
import { MemoValues, QuestionQuery } from "actions";
import { memosToQuestions } from "../../engines/memorizer.js";
import { ConfigCategory } from "../../enums/actions.js";
import { pathCreator } from "../../utils/helpers/pathCreator.js";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { AppOptions } from "app";

/**
 * This function will be fired by the --create-main option
 */
const createMainBuilder = async (
    memoValues: MemoValues,
    options: AppOptions
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
                "Makefile",
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
                // get the names variants and the paths
                const createMainObj = {
                    projectName,
                    rootDir,
                    isAWS,
                    isMailer,
                    publicDir,
                    mainDest,
                    schemasPath: join(mainDest, "schemas"),
                };

                await manipulator({
                    actionTag: "create-main",
                    cloningCommands: createMainCloning(createMainObj),
                    injectionCommands: createMainInjection(createMainObj),
                    memo: {
                        pairs: { mainDest, rootDir, projectName, publicDir },
                        category: ConfigCategory.RAVEN_NEST,
                    },
                    overwrite,
                });
            }
        );
};

export default createMainBuilder;
