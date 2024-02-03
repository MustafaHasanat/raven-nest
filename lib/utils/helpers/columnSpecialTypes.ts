/* eslint-disable prefer-const */
import { InjectTemplate } from "../../types/injectTemplate.js";
import { ColumnTypeChoice } from "../../enums/createAction.js";
import inquirer from "inquirer";
import { replaceStrings } from "./stringsHelpers.js";
import constants from "../../utils/constants/builderConstants.js";

// --- interfaces ---

type AddSpecialItemsProps = {
    columnName: string;
    columnType: ColumnTypeChoice;
    entityProperties: string | null;
    dtoProperties: string | null;
    decorators: {
        decoratorsValues: string | null;
        decoratorsImports: string | null;
    };
};

type AddSpecialItemsReturn = AddSpecialItemsProps & {
    specialInjections: InjectTemplate[];
};

// --- methods ---

const appendItem = (original: string | null, item: string): string => {
    if (!original || original === "") return item;
    else return `${original}, ${item}`;
};

const addSpecialItems = async ({
    columnName,
    columnType,
    entityProperties,
    dtoProperties,
    decorators: { decoratorsValues, decoratorsImports },
}: AddSpecialItemsProps): Promise<AddSpecialItemsReturn> => {
    const fullEntityProperties = entityProperties;
    const fullDtoProperties = dtoProperties;
    let modifiedDecoratorsValues = decoratorsValues;
    let modifiedDecoratorsImports = decoratorsImports;

    if (decoratorsValues) {
        if (decoratorsValues.indexOf("MIN_LENGTH") !== -1) {
            await inquirer
                .prompt([constants.createColumn.stringLength])
                .then(async ({ stringLength }) => {
                    const [minimum, maximum] = stringLength.trim().split(",");
                    modifiedDecoratorsValues = await replaceStrings({
                        contents: decoratorsValues,
                        items: [
                            {
                                oldString: "MIN_LENGTH",
                                newString: minimum,
                            },
                            {
                                oldString: "MAX_LENGTH",
                                newString: maximum,
                            },
                        ],
                    });
                });
        }
    }

    switch (columnType) {
        case ColumnTypeChoice.DATE:
            appendItem(fullEntityProperties, "type: 'date'");
            break;
        case ColumnTypeChoice.TIME:
            appendItem(
                fullEntityProperties,
                "type: 'time', default: new Date().toLocaleTimeString()"
            );
            break;

        default:
            break;
    }

    return {
        columnName,
        columnType,
        entityProperties: fullEntityProperties,
        dtoProperties: fullDtoProperties,
        decorators: {
            decoratorsValues: modifiedDecoratorsValues,
            decoratorsImports: modifiedDecoratorsImports,
        },
        specialInjections: [],
    };
};

export { addSpecialItems };
