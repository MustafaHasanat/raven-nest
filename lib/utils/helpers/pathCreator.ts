import { existsSync, mkdirSync } from "fs";

/**
 * Assure that a path exists, then create it with all its descendant sub-paths
 *
 * @param path The path to be checked
 * @param prefix Used to accumulate the path recursively (internal use only)
 *
 * @usage
 * createPathsIfNotExist("src/assets/html");
 *
 * > then 3 folders will be created if any of them doesn't exist
 * --> src/
 * --> src/assets/
 * --> src/assets/html/
 */
const pathCreator = (paths: string[], prefix: string = "") => {
    paths.forEach((path) => {
        const segments = path.split("/");

        const newPath = prefix + (prefix ? "/" : "") + segments[0];
        if (!existsSync(newPath)) {
            mkdirSync(newPath);
        }

        if (segments.length > 1) {
            pathCreator([segments.slice(1).join("/")], newPath);
        } else if (segments.length === 1) {
            return;
        }
    });
};

export { pathCreator };
