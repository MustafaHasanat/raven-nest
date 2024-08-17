import { InjectTemplate } from "engine";
import { specialLog } from "../utils/helpers/logHelpers.js";
import { additionAction } from "./tools/additionAction.js";
import { deletionAction } from "./tools/deletionAction.js";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";

/**
 * Inject one or more texts or templates in a single injectable file
 *
 * @param files[] A list of object to be addressed
 *      @param injectable The existing file to be modified
 *      @param actions[] A list of injection objects
 *          @param addition The source file that has the text to be injected
 *          @param keyword A string indicating where in the injectable file do we want to add the new text
 *          @param additionIsFile A boolean indication if we need to treat the addition as a file or as a simple string
 *          @param supposedToBeThere If a string was provided, abort the injection action IF the string was found in the original string
 *          @param replacements[] A list of pairs to be replaced in the addition file before injection
 *              @param oldString The old string
 *              @param newString The new string
 * @usage
 */
const injectTemplates = async (files: InjectTemplate[]): Promise<boolean> => {
    specialLog({
        message: "Injecting templates",
        situation: "PROCESS",
    });

    try {
        await Promise.all(
            files.map(
                async ({
                    injectable,
                    prioritize = "addition",
                    additions,
                    deletions,
                }: InjectTemplate) => {
                    const injectablePath = join(process.cwd(), injectable);
                    const injectableContents = await readFile(
                        injectablePath,
                        "utf8"
                    );

                    const modifiedStage1 =
                        prioritize === "addition"
                            ? await additionAction({
                                  additions: additions || [],
                                  injectableContents,
                              })
                            : await deletionAction({
                                  deletions: deletions || [],
                                  injectableContents,
                              });

                    if (!modifiedStage1) {
                        specialLog({
                            message:
                                "Error occurred at injectTemplates sub-functions",
                            situation: "ERROR",
                            scope:
                                prioritize === "addition"
                                    ? "additionAction"
                                    : "deletionAction",
                        });
                        return false;
                    }

                    const modifiedStage2 =
                        prioritize === "addition"
                            ? await deletionAction({
                                  deletions: deletions || [],
                                  injectableContents: modifiedStage1,
                              })
                            : await additionAction({
                                  additions: additions || [],
                                  injectableContents: modifiedStage1,
                              });

                    if (!modifiedStage2) {
                        specialLog({
                            message:
                                "Error occurred at injectTemplates sub-functions",
                            situation: "ERROR",
                            scope:
                                prioritize === "deletion"
                                    ? "deletionAction"
                                    : "additionAction",
                        });
                        return false;
                    }

                    await writeFile(injectablePath, modifiedStage2, "utf8");

                    specialLog({
                        message: `File '${injectable}' has been modified successfully`,
                        situation: "MESSAGE",
                    });
                }
            )
        );

        specialLog({
            message: "Injection is done",
            situation: "RESULT",
            isBreak: true,
        });
        return true;
    } catch (error) {
        specialLog({
            message: `${error}`,
            situation: "ERROR",
            scope: "injectTemplates",
        });
        return false;
    }
};

export default injectTemplates;
