import inquirer from "inquirer";
import {
    initCloning,
    initInjection,
} from "../../commands/init/initialPack.js";
import manipulator from "../../engines/manipulator.js";
import constants from "../../utils/constants/builderConstants.js";
import { pathCreator } from "../../utils/helpers/pathCreator.js";
import { specialLog } from "../../utils/helpers/logHelpers.js";

export default async function initBuilder() {
    inquirer
        .prompt([constants.shared.overwrite(["ravenconfig.json", ".gitignore"])])
        .then(async ({ overwrite }) => {
            pathCreator(["src/common"]);

            await manipulator({
                actionTag: "init-install",
                cloningCommands: initCloning(),
                injectionCommands: initInjection(),
                overwrite,
                skipOverwrite: true,
            });

            specialLog({
                message: "Process finished",
                situation: "RESULT",
            });
        });
}
