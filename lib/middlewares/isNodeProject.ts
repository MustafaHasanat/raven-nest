import { execSync } from "child_process";
import { specialLog } from "../utils/helpers/logHelpers.js";

const isNodeProject = () => {
    // check if this is a node project
    const isNodeProject = execSync("ls")
        .toString()
        .split("\n")
        .includes("package.json");

    if (!isNodeProject) {
        specialLog({
            message: "This is not a Node.js project directory",
            situation: "ERROR",
        });
        process.exit(1);
    }
};

export { isNodeProject };
