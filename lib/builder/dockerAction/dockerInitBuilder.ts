import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import manipulator from "../../manipulator/index.js";
import { initDockerCloning } from "../../commands/dockerAction/initDocker.js";
import { specialLog } from "../../utils/helpers/logHelpers.js";

export default async function dockerInitBuilder() {
    inquirer
        .prompt([
            constants.shared.overwrite([
                "docker-compose.yaml",
                "Dockerfile",
                ".dockerignore",
            ]),
        ])
        .then(async ({ overwrite }) => {
            await manipulator({
                cloningCommands: initDockerCloning(),
                overwrite,
            });

            specialLog({
                message: "Process finished",
                situation: "RESULT",
            });
        });
}
