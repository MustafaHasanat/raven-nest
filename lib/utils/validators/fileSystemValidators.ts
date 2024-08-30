import { ConfigCategory } from "../../enums/actions.js";
import { readConfigFile } from "../../engines/memorizer.js";
import { inputValidator } from "./stringValidators.js";

export const columnTableValidator = async (
    tableName: string
): Promise<boolean | string> => {
    const nameValidator = inputValidator({ input: tableName });

    if (typeof nameValidator === "string" || !nameValidator)
        return nameValidator;

    const memoContents: any = await readConfigFile(ConfigCategory.RAVEN_NEST);

    if (!memoContents[ConfigCategory.RAVEN_NEST]["tables"][tableName])
        return `Table "${tableName}" doesn't exist (check your memo file if it does)`;

    return true;
};
