import { execSync } from "child_process";
import { specialLog } from "../utils/helpers/logHelpers.js";
import constants from "../utils/constants/installer.js";
import initBuilder from "../builder/install/installInitBuilder.js";

const initAction = async () => {
    try {
        // Init the dependencies
        specialLog({
            message: "Installing dependencies",
            situation: "PROCESS",
        });
        execSync(`npm i --save ${constants.nestDependencies.join(" ")}`);
        specialLog({
            message: "Process finished",
            situation: "RESULT",
        });
        // Install the dev-dependencies
        specialLog({
            message: "Installing dev-dependencies",
            situation: "PROCESS",
        });
        execSync(`npm i --save-dev ${constants.nestDevDependencies.join(" ")}`);
        specialLog({
            message: "Process finished",
            situation: "RESULT",
        });
        // Initializing the "ravenconfig.json" file
        specialLog({
            message: "Initializing",
            situation: "PROCESS",
        });
        // call the builder
        initBuilder();
    } catch (error) {
        specialLog({
            message: `${error}`,
            situation: "ERROR",
            scope: "installAction",
        });
        return;
    }
};

export default initAction;
