import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import manipulator from "../../engines/manipulator.js";
import {
    initDockerCloning,
    initDockerInjection,
} from "../../commands/docker/initDocker.js";
import { specialLog } from "../../utils/helpers/logHelpers.js";
import { MemoCategory } from "../../enums/actions.js";
import { MemoValues, QuestionQuery } from "actions";
import { memosToQuestions } from "../../engines/memorizer.js";

export default async function dockerizeInitBuilder(memoValues: MemoValues) {
    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.dockerInit.projectName,
                constants.dockerInit.rootDir,
            ] as QuestionQuery[]),
            constants.shared.overwrite([
                "docker-compose.yaml",
                "Dockerfile",
                ".dockerignore",
                ".env",
            ]),
        ])
        .then(async ({ overwrite, projectName, rootDir }) => {
            await manipulator({
                actionTag: "init-docker",
                cloningCommands: initDockerCloning(projectName),
                injectionCommands: initDockerInjection(rootDir),
                overwrite,
                memo: {
                    pairs: { projectName },
                    category: MemoCategory.RAVEN_NEST,
                },
            });

            specialLog({
                message: "Process finished",
                situation: "RESULT",
            });
        });
}
