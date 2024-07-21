import { specialLog } from "../../utils/helpers/logHelpers.js";
import { InjectionDeletionAction } from "../../types/injectTemplate.js";
import {
    getStrInBetween,
    indexStringCutter,
    replaceStrings,
} from "../../utils/helpers/stringsHelpers.js";

export const deletionAction = async (props: {
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
    else if (special === "INDEX_CUT") {
        modifiedInjectable = indexStringCutter({
            content: injectableContents,
            startIndex,
            endIndex,
        });
    } else {
        modifiedInjectable = await replaceStrings({
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
