import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import { createLandingPageCloning } from "../../commands/create/createLandingPage.js";
import manipulator from "../../engines/manipulator.js";
import { MemoValues, QuestionQuery } from "../../types/actions.js";
import { memosToQuestions } from "../../engines/memorizer.js";
import { MemoCategory } from "../../enums/actions.js";

/**
 * This function will be fired by the --create-landing-page option
 */
const createLandingPageBuilder = async (memoValues: MemoValues) => {
    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.createLandingPage.projectName,
                constants.createLandingPage.publicDir,
            ] as QuestionQuery[]),
            constants.shared.overwrite([
                "public/index.html",
                "public/styles/main.css",
            ]),
        ])
        .then(async ({ projectName, publicDir, overwrite }) => {
            await manipulator({
                actionTag: "create-landing-page",
                cloningCommands: createLandingPageCloning(
                    publicDir,
                    projectName
                ),
                memo: {
                    pairs: { publicDir, projectName },
                    category: MemoCategory.RAVEN_NEST,
                },
                overwrite,
            });
        });
};

export default createLandingPageBuilder;
