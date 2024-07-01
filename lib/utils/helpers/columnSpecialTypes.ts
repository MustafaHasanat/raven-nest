/* eslint-disable prefer-const */
import { InjectTemplate } from "../../types/injectTemplate.js";
import { ColumnTypeChoice } from "../../enums/createAction.js";
import inquirer from "inquirer";
import { replaceStrings } from "./stringsHelpers.js";
import constants from "../../utils/constants/builderConstants.js";
import { columnTypeDefaultMap } from "../constants/builderMapping.js";

// --- interfaces ---

type AddSpecialItemsBase = {
    columnName: string;
    columnType: ColumnTypeChoice;
    entityProperties: string | null;
    dtoProperties: string | null;
    decorators: {
        decoratorsValues: string | null;
        decoratorsImports: string | null;
    };
};

type AddSpecialItemsProps = AddSpecialItemsBase & {
    isRequired: boolean;
    description: string;
};

type AddSpecialItemsReturn = AddSpecialItemsBase & {
    specialInjections: InjectTemplate[];
    mapsData: {
        dtoCreate: string | null;
        dtoUpdate: string | null;
        entityType: string;
        dtoType: string;
    };
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
    isRequired,
    description,
    decorators: { decoratorsValues, decoratorsImports },
}: AddSpecialItemsProps): Promise<AddSpecialItemsReturn> => {
    let specialDescription = null;
    let modifiedEntityProperties = entityProperties || "";
    let modifiedDtoProperties = dtoProperties || "";
    let modifiedDecoratorsValues = decoratorsValues || "";
    let modifiedDecoratorsImports = decoratorsImports || "";

    // add the special types' properties to the entity and DTO objects
    switch (columnType) {
        case ColumnTypeChoice.DATE:
            appendItem(modifiedEntityProperties, "type: 'date'");
            break;
        case ColumnTypeChoice.TIME:
            appendItem(
                modifiedEntityProperties,
                "type: 'time', default: new Date().toLocaleTimeString()"
            );
            break;
        case ColumnTypeChoice.ENUM:
            appendItem(
                modifiedEntityProperties,
                "type: 'enum',\nenum: ENUM_OBJECT,\ndefault: ENUM_OBJECT.SELECT_OPTION"
            );
            appendItem(modifiedDtoProperties, "enum: ENUM_OBJECT");
            break;

        default:
            break;
    }

    // add the necessary parts for the decorators object
    if (modifiedDecoratorsValues) {
        if (modifiedDecoratorsValues.indexOf("MIN_LENGTH") !== -1) {
            await inquirer
                .prompt([constants.createColumn.stringLength])
                .then(async ({ stringLength }) => {
                    const [minimum, maximum] = stringLength.trim().split(",");
                    modifiedDecoratorsValues = await replaceStrings({
                        contents: modifiedDecoratorsValues,
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
        if (modifiedDecoratorsValues.indexOf("IsPhoneNumber") !== -1) {
            specialDescription =
                "Phone number must start with a plus sign, followed by country code, then the number";
        }
        if (modifiedDecoratorsValues.indexOf("ENUM_OBJECT") !== -1) {
            await inquirer
                .prompt([
                    constants.createColumn.enumName,
                ])
                .then(async ({ enumName }) => {
                    modifiedDecoratorsValues = await replaceStrings({
                        contents: modifiedDecoratorsValues,
                        items: [
                            {
                                oldString: "ENUM_OBJECT",
                                newString: enumName,
                            },
                        ],
                    });
                });
        }
    }

    return {
        columnName,
        columnType,
        mapsData: columnTypeDefaultMap(
            isRequired,
            description || `${specialDescription || ""}`
        )[columnType],
        entityProperties: modifiedEntityProperties,
        dtoProperties: modifiedDtoProperties,
        decorators: {
            decoratorsValues: modifiedDecoratorsValues,
            decoratorsImports: modifiedDecoratorsImports,
        },
        specialInjections: [],
    };
};

export { addSpecialItems };
