import { join, dirname } from "path";

const getDirename = () => {
    return dirname(new URL(import.meta.url).pathname);
    // return dirname(__dirname);
};

/**
 * Returns the root path for the project
 * This is used to get to the root dir of the package installed in another device so we can reach the static files
 *
 * @param relativePathToRoot The path to the root from the calling file (it will be something like this: "../../..")
 * @returns The root dir of this project regardless of the device
 */
const getCurrentRelativePath = (relativePathToRoot: string) => {
    const rootDir = join(getDirename(), relativePathToRoot);

    return rootDir;
};

// const getRelativePathFromDirs = (srcDir: string, distDir: string): string => {
//     const srcDirs = srcDir.split("/");
//     const distDirs = distDir.split("/");

//     [...srcDirs].forEach((srcElement) => {
//         if (distDirs.includes(srcElement)) {
//             delete srcDirs[0];
//             delete distDirs[0];
//         }
//     });

//     console.log(srcDirs);
//     console.log(distDirs);

//     return (
//         srcDirs.reduce((acc: string, curr: string) => acc + "../", "") +
//         distDirs.join("/")
//     );
// };

export { getCurrentRelativePath };
