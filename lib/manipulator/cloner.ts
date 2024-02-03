import { join } from "path";
import { CloneTemplate } from "../types/cloneTemplate.js";
import { writeFile } from "fs/promises";
import { pathCreator } from "../utils/helpers/pathCreator.js";
import { replaceStrings } from "../utils/helpers/stringsHelpers.js";
import { readFile } from "fs/promises";
import { getCurrentRelativePath } from "../utils/helpers/pathHelpers.js";
import { specialLog } from "../utils/helpers/logHelpers.js";

/**
 * Create a copy of a template file with replacing the placeholders by a specific text
 *
 * @param files[] A list of objects to be addressed, each on contains:
 *      @param target The relative path for the template file
 *      @param dest The destination path
 *      @param newFileName The new name for the created file
 *      @param replacements[] A list of pairs to be replaced
 *          @param oldString The old string
 *          @param newString The new string
 * @usage
 * await manipulator.cloneTemplates([
 *  {
 *      target: "base/typescript/app/main-file.txt",
 *      dest: ".",
 *      newFileName: "main.ts",
 *      replacements: [
 *          {
 *              oldString: "PROJECT_NAME",
 *              newString: answers.projectName,
 *          },
 *      ],
 *  }
 * ]);
 */
const cloneTemplates = async (files: CloneTemplate[]): Promise<boolean> => {
    specialLog({ message: "Cloning templates", situation: "PROCESS" });

    try {
        await Promise.all(
            files.map(
                async ({
                    target,
                    destination,
                    newFileName,
                    replacements = [],
                }: CloneTemplate) => {
                    const outputFilePath = join(
                        process.cwd(),
                        destination,
                        newFileName
                    );

                    pathCreator([destination]);

                    const contents = await readFile(
                        join(
                            getCurrentRelativePath("../../.."),
                            join("templates", target)
                        ),
                        "utf8"
                    );
                    const modifiedFile = await replaceStrings({
                        contents,
                        items: replacements,
                    });

                    await writeFile(outputFilePath, modifiedFile, "utf8");

                    specialLog({
                        message: `File '${newFileName}' has been saved successfully at '${process.cwd()}/${destination}'`,
                        situation: "MESSAGE",
                    });
                }
            )
        );

        specialLog({
            message: "Cloning is done",
            situation: "RESULT",
        });
        return true;
    } catch (error) {
        specialLog({
            message: `${error}`,
            situation: "ERROR",
            scope: "cloneTemplates",
        });
        return false;
    }
};

export default cloneTemplates;
