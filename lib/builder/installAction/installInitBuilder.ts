import inquirer from "inquirer";
import {
    installInitCloning,
    installInitInjection,
} from "../../commands/installAction/initialPack.js";
import manipulator from "../../manipulator/index.js";
import constants from "../../utils/constants/builderConstants.js";
import { pathCreator } from "../../utils/helpers/pathCreator.js";
import { specialLog } from "../../utils/helpers/logHelpers.js";

export default async function installInitBuilder() {
    inquirer
        .prompt([constants.shared.overwrite(["memo.json", ".gitignore"])])
        .then(async ({ overwrite }) => {
            pathCreator(["src/ravennest"]);

            await manipulator({
                actionTag: "init-install",
                cloningCommands: installInitCloning(),
                injectionCommands: installInitInjection(),
                overwrite,
                skipOverwrite: true,
            });

            specialLog({
                message: "Process finished",
                situation: "RESULT",
            });
        });
}
