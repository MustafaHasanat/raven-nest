import { InjectionAdditionAction } from "engine";
import { specialLog } from "../../utils/helpers/logHelpers.js";

/**
 * Injects the 'addition' string at the 'keyword' index inside the 'original' string
 *
 * @param original The original string
 * @param keyword The injection string to be found (inject at the start if equals one star '*', and at the end if equals two stars '**')
 * @param addition The content string to be added to the original file
 * @param supposedToBeThere If a string was provided, abort the injection action IF the string was found in the original string
 * @returns The resultant string
 */
export const injectString = ({
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
