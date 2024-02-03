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
const replaceStrings = async ({
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

const getStrInBetween = (
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

export { replaceStrings, getStrInBetween };
