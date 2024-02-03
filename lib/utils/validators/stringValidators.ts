import { existsSync } from "fs";

const inputValidator = ({
    input,
    allowEmpty = false,
    allowSpaces = false,
    isDestination = false,
}: {
    input: string;
    allowEmpty?: boolean;
    allowSpaces?: boolean;
    isDestination?: boolean;
}): boolean | string => {
    // TODO: complete with regex expressions to validate the naming string

    if (!allowEmpty && !input) return "You can't leave this prompt empty!";
    if (!allowSpaces && input.includes(" "))
        return "You can't have spaces here!";
    if (isDestination && !existsSync(input)) return "Path doesn't exist!";

    return true;
};

const stringLengthValidator = (input: string): boolean | string => {
    if (input.indexOf(",") === -1)
        return "You must have a comma separating the lengths!";
    if (input.indexOf(" ") !== -1) return "You shouldn't have any space!";
    if (input.indexOf(".") !== -1)
        return "You shouldn't have any decimal points!";

    const [minimum, maximum] = input.trim().split(",");

    if (
        (!!!Number(minimum) && minimum !== "0") ||
        (!!!Number(maximum) && maximum !== "0")
    )
        return "Both sides of the comma must be integers!";
    if (Number(minimum) >= Number(maximum))
        return "The max limit MUST be less than the min limit";

    return true;
};

const checkboxValidator = ({
    options,
    isOne = false,
}: {
    options: string[];
    isOne?: boolean;
}): boolean | string => {
    if (isOne && options.length !== 1) {
        return "Choose exactly one of the above!";
    }
    return true;
};

const tableNamesValidator = (tables: string) => {
    if (!tables) return "You must enter the names of your tables!";
    if (tables.indexOf("-") === -1) return "You must have the dash symbol: -";
    if (tables.indexOf(" ") !== -1) return "You must not use any space";

    return true;
};

export {
    inputValidator,
    stringLengthValidator,
    checkboxValidator,
    tableNamesValidator,
};
