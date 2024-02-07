import { execSync } from "child_process";
import { existsSync } from "fs";

const pathConvertor = (dest: string, suffix: string): string =>
    `${dest || ""}${dest ? "/" : ""}${suffix}`;

/**
 * Check if all the files exists in the current directory and return the missing ones
 * @param files The list of the files
 * @returns The missing files
 */
const missingFiles = (files: string[]): string[] => {
    if (files.length === 0) return [];

    const results: string[] = [];

    files.forEach((file) => {
        if (!existsSync(file)) {
            results.push(file);
        }
    });

    return results;
};

/**
 * Capitalize the first letter of the string
 * @param string
 * @returns
 */
const firstCharToUpper = (string: string): string => {
    if (string.length < 2) {
        throw new Error("The string is too short!");
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Lowercase the first letter of the string
 * @param string
 * @returns
 */
const firstCharToLower = (string: string): string => {
    if (string.length < 2) {
        throw new Error("The string is too short!");
    }
    return string.charAt(0).toLocaleLowerCase() + string.slice(1);
};

/**
 * Convert the string to plural case
 * @param string
 * @returns
 */
const pluralize = (string: string): string => {
    const endWithYRegex = /[^aeiou]y$/i;
    const isEndWithY = endWithYRegex.test(string);
    if (isEndWithY) {
        return string.replace(/y$/i, "ies");
    }

    const specialCasesRegex = /(o|s|x|z|ch|sh)$/i;
    const isSpecialCase = specialCasesRegex.test(string);
    if (isSpecialCase) {
        return string + "es";
    }

    return string + "s";
};

const generateJWTSecret = () => {
    return execSync("openssl rand -base64 32").toString();
};

export {
    pathConvertor,
    missingFiles,
    firstCharToUpper,
    firstCharToLower,
    pluralize,
    generateJWTSecret,
};
