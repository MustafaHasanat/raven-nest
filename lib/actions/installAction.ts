import { execSync } from "child_process";
import { specialLog } from "../utils/helpers/logHelpers.js";
import constants from "../utils/constants/installActionConstants.js";
import installInitBuilder from "../builder/installAction/installInitBuilder.js";

const installAction = async () => {
    try {
        // Install the dependencies
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
        // Initializing the "memo.json" file
        specialLog({
            message: "Initializing",
            situation: "PROCESS",
        });
        // call the builder
        installInitBuilder();
    } catch (error) {
        specialLog({
            message: `${error}`,
            situation: "ERROR",
            scope: "newAction",
        });
        return;
    }
};

export default installAction;
