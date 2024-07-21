type ReplaceItem = {
    oldString: string;
    newString: string;
};

type ReplaceStringsProps = {
    contents: string;
    items: ReplaceItem[];
};

const replaceOne = ({
    contents,
    oldString,
    newString,
}: ReplaceItem & { contents: string }) => {
    const regexPattern = new RegExp(oldString, "g");
    return contents.replace(regexPattern, newString);
};

/**
 * Replace all occurrences of the the string with the new ones
 *
 * @param contents The parsed contents of the file
 * @param items An array of items to be replaced in the contents, each of them has 'oldString' and 'newString'
 * @returns
 */
export const replaceStrings = async ({
    contents,
    items,
}: ReplaceStringsProps): Promise<string> => {
    if (!items.length) {
        return contents;
    }

    const modifiedContent = replaceOne({ ...items[0], contents });

    return replaceStrings({
        items: items.slice(1),
        contents: modifiedContent,
    });
};

/**
 * Delete the portion of the string from "startIndex" to "endIndex" inclusively
 * @param content
 * @param startIndex
 * @param endIndex
 * @returns
 */
export const indexStringCutter = ({
    content,
    startIndex,
    endIndex,
}: {
    content: string;
    startIndex: number;
    endIndex: number;
}): string => {
    return content.slice(0, startIndex) + content.slice(endIndex);
};

export const getStrInBetween = (
    searchTerm: string,
    start: number,
    end: number
): string | null => {
    if (
        start < 0 ||
        start > searchTerm.length ||
        end > searchTerm.length ||
        end < start
    ) {
        return null;
    }

    return searchTerm.substring(start, end + 1);
};
