import { join } from "path";
import {
    InjectTemplate,
    InjectionAdditionAction,
    InjectionDeletionAction,
} from "../types/injectTemplate.js";
import { readFile, writeFile } from "fs/promises";
import {
    getStrInBetween,
    indexStringCutter,
    replaceStrings,
} from "../utils/helpers/stringsHelpers.js";
import { specialLog } from "../utils/helpers/logHelpers.js";
import { getCurrentRelativePath } from "../utils/helpers/pathHelpers.js";
import { getTemplatesDir } from "../utils/constants/app.js";

/**
 * Injects the 'addition' string at the 'keyword' index inside the 'original' string
 *
 * @param original The original string
 * @param keyword The injection string to be found (inject at the start if equals one star '*', and at the end if equals two stars '**')
 * @param addition The content string to be added to the original file
 * @param supposedToBeThere If a string was provided, abort the injection action IF the string was found in the original string
 * @returns The resultant string
 */
const injectString = ({
    original,
    keyword,
    addition: {
        base,
        conditional: { type, data } = {
            type: "NONE",
            data: null,
        },
    },
    replica,
}: InjectionAdditionAction & {
    original: string;
}): string | null | "SKIPPED" => {
    try {
        // abort the injection action if:
        // - conditional.type === 'SUPPOSED_TO_BE_THERE' and conditional.data was found in the original string
        // - 'base' was found in the original string
        if (
            (type === "SUPPOSED_TO_BE_THERE" &&
                original.indexOf(`${data}`) !== -1) ||
            (original.indexOf(base) !== -1 && !replica)
        ) {
            return "SKIPPED";
        }

        const index = original.indexOf(keyword);
        if (index === -1 && !["*", "**"].includes(keyword)) {
            specialLog({
                message: `keyword='${keyword}' doesn't exist in the 'original' string`,
                situation: "ERROR",
                scope: "mismatch",
            });
            return null;
        }
        let injectPosition;
        if (keyword === "*") injectPosition = 0;
        else if (keyword === "**") injectPosition = original.length;
        else injectPosition = index + keyword.length;

        const [leftSide, rightSide] = [
            original.slice(0, injectPosition),
            original.slice(injectPosition),
        ];

        return leftSide + base + rightSide;
    } catch (error) {
        specialLog({
            message: error as string,
            situation: "ERROR",
            scope: "injectString",
        });
        return null;
    }
};

/**
 * Recursively inject the targets into the injectable string
 *
 * @param actions[] A list of injection objects (check the injectTemplates function for more details)
 * @param injectableContents The accumulated result of the original content after injecting all the action objects
 * @returns The final result of the file after injecting all the contents
 */
const additionAction = async (props: {
    additions: InjectionAdditionAction[];
    injectableContents: string;
}): Promise<string | null> => {
    try {
        if (!props) return null;

        const { additions, injectableContents } = props;

        if (!additions.length) {
            return injectableContents;
        }
        if (additions[0] === null) {
            return await additionAction({
                additions: additions.slice(1),
                injectableContents,
            });
        }

        const {
            addition: {
                base,
                additionIsFile = true,
                conditional: { type, data } = {
                    type: "NONE",
                    data: null,
                },
            },
            keyword,
            replacements = [],
            replica = false,
        } = additions[0];

        if (!additionIsFile && replacements.length > 0) {
            specialLog({
                message:
                    "You shouldn't have items in 'replacements' while 'additionIsFile' is false!",
                situation: "ERROR",
                scope: "tool misuse",
            });
            return null;
        }

        if (type === "SUPPOSED_TO_BE_THERE" && replica) {
            specialLog({
                message:
                    "You can't have a value for 'SUPPOSED_TO_BE_THERE' and set 'replica' to true!",
                situation: "ERROR",
                scope: "tool misuse",
            });
            return null;
        }

        // read the contents of the file (if it was a file)
        const additionContents = additionIsFile
            ? await readFile(
                  join(
                      getCurrentRelativePath("../../.."),
                      join(getTemplatesDir(), base)
                  ),
                  "utf8"
              )
            : base;

        // apply all the replacements on the contents
        const modifiedAddition = additionIsFile
            ? await replaceStrings({
                  contents: additionContents,
                  items: replacements,
              })
            : additionContents;

        // inject the final result into the original file's contents
        const modifiedInjectable = injectString({
            original: injectableContents,
            keyword,
            addition: {
                base: modifiedAddition,
                conditional: {
                    type,
                    data,
                },
            },
            replica,
        });

        if (!modifiedInjectable) {
            specialLog({
                message: "error occurred while modifying the file",
                situation: "ERROR",
                scope: "tool misuse",
            });
            return null;
        }

        // recursively apply all the actions on teh original file
        return await additionAction({
            additions: additions.slice(1),
            injectableContents:
                modifiedInjectable !== "SKIPPED"
                    ? modifiedInjectable
                    : injectableContents,
        });
    } catch (error) {
        specialLog({
            message: error as string,
            situation: "ERROR",
            scope: "additionAction",
        });
        return null;
    }
};

const deletionAction = async (props: {
    deletions: InjectionDeletionAction[];
    injectableContents: string;
}): Promise<string | null> => {
    if (!props) return null;

    const { deletions, injectableContents } = props;

    if (!deletions.length) {
        return injectableContents;
    }
    if (deletions[0] === null) {
        return await deletionAction({
            deletions: deletions.slice(1),
            injectableContents,
        });
    }

    const {
        keyword,
        deletion: {
            isWholeLine = false,
            mayNotBeThere = false,
            onlyFirstOccurrence = false,
            conditional: { type, data, special } = {
                type: "NONE",
                data: null,
                special: undefined,
            },
        } = {},
    } = deletions[0];

    let newString = "";
    const startIndex = injectableContents.indexOf(keyword);
    const endIndex = injectableContents.indexOf("\n", startIndex);
    const isItThere = startIndex !== -1;

    if (!isItThere && !mayNotBeThere) {
        specialLog({
            message: `The 'keyword=${keyword}' doesn't exist in the injectable content`,
            situation: "ERROR",
            scope: "deletionAction",
        });
        return null;
    }

    if (mayNotBeThere && isWholeLine) {
        specialLog({
            message:
                "You can't have both 'mayNotBeThere' and 'isWholeLine' parameters together",
            situation: "ERROR",
            scope: "deletionAction",
        });
        return null;
    }

    if (isWholeLine) {
        newString = getStrInBetween(
            injectableContents,
            startIndex,
            endIndex
        ) as string;
    }

    let modifiedInjectable = "";

    if (onlyFirstOccurrence)
        modifiedInjectable = injectableContents.replace(keyword, "");
    else if (special) {
        modifiedInjectable = indexStringCutter({
            content: injectableContents,
            startIndex,
            endIndex
        });
    } else {
        await replaceStrings({
            contents: injectableContents,
            items:
                !isItThere && mayNotBeThere
                    ? []
                    : [
                          {
                              oldString: isWholeLine ? newString : keyword,
                              newString:
                                  type === "REPLACED_WITH"
                                      ? `${data}`
                                      : newString,
                          },
                      ],
        });
    }
    // recursively apply all the actions on teh original file
    return await deletionAction({
        deletions: deletions.slice(1),
        injectableContents: modifiedInjectable,
    });
};

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
 * await manipulator.injectTemplates(
 *      [
 *          {
 *              injectable: appModuleLocation,
 *              actions: [
 *                 {
 *                     addition: "components/typescript/app/db/config.txt",
 *                     keyword: "imports: [",
 *                 },
 *                 {
 *                     addition: "components/typescript/app/db/imports.txt",
 *                     keyword: "*",
 *                     replacements: [
 *                         {
 *                             oldString: "PATH_TO_ENTITIES",
 *                             newString: dest,
 *                         },
 *                     ],
 *                 },
 *             ],
 *         },
 *      ]
 * )
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
                    additions,
                    deletions,
                }: InjectTemplate) => {
                    const injectablePath = join(process.cwd(), injectable);
                    const injectableContents = await readFile(
                        injectablePath,
                        "utf8"
                    );

                    const modifiedStage1 = await additionAction({
                        additions: additions || [],
                        injectableContents,
                    });

                    if (!modifiedStage1) {
                        specialLog({
                            message:
                                "Error occurred at injectTemplates sub-functions",
                            situation: "ERROR",
                            scope: "additionAction",
                        });
                        return false;
                    }

                    const modifiedStage2 = await deletionAction({
                        deletions: deletions || [],
                        injectableContents: modifiedStage1,
                    });

                    if (!modifiedStage2) {
                        specialLog({
                            message:
                                "Error occurred at injectTemplates sub-functions",
                            situation: "ERROR",
                            scope: "deletionAction",
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
