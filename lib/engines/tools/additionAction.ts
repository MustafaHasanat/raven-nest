import { getCurrentRelativePath } from "../../utils/helpers/pathHelpers.js";
import { getTemplatesDir } from "../../utils/constants/app.js";
import { injectString } from "./injectString.js";
import { specialLog } from "../../utils/helpers/logHelpers.js";
import { replaceStrings } from "../../utils/helpers/stringsHelpers.js";
import { join } from "path";
import { readFile } from "fs/promises";
import { InjectionAdditionAction } from "engine";

/**
 * Recursively inject the targets into the injectable string
 *
 * @param actions[] A list of injection objects (check the injectTemplates function for more details)
 * @param injectableContents The accumulated result of the original content after injecting all the action objects
 * @returns The final result of the file after injecting all the contents
 */
export const additionAction = async (props: {
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

        // if (!additionIsFile && replacements.length > 0) {
        //     specialLog({
        //         message:
        //             "You shouldn't have items in 'replacements' while 'additionIsFile' is false!",
        //         situation: "ERROR",
        //         scope: "tool misuse",
        //     });
        //     return null;
        // }

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
        const modifiedAddition = await replaceStrings({
            contents: additionContents,
            items: replacements,
        });

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
