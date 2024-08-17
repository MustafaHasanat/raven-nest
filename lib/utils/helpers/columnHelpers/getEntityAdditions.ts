/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetColumnInjectionAdditions } from "../../../interfaces/builder.js";
import {
    ColumnDecoratorChoice,
    ColumnPropertyChoice,
    ColumnTypeChoice,
} from "../../../enums/createAction.js";
import { decoratorsMapObject } from "../../../utils/constants/builderMapping.js";
import inquirer from "inquirer";
import constants from "../../../utils/constants/builderConstants.js";
import { InjectionAdditionAction } from "engine";

const getEntityAdditions = async ({
    columNameVariants,
    columnDecorators,
    columnProperties,
    columnType,
    defaultValue,
}: GetColumnInjectionAdditions): Promise<InjectionAdditionAction[]> => {
    const entityAdditions: InjectionAdditionAction[] = [];
    const replacements: any = [];

    // get the default value
    let specialDefault = "''";

    if (columnType[0] === ColumnTypeChoice.TIME)
        specialDefault = "'new Date().toLocaleTimeString()'";

    if (columnType[0] === ColumnTypeChoice.ENUM)
        specialDefault = "'ENUM_OBJECT.SELECT_OPTION'";

    // create a base component
    const entityBase = `
        // --- decorators ---
        @Column({
            type: "${columnType[0]}",
            default: ${specialDefault || defaultValue},
            IS_NULLABLE_PLACEHOLDER
            IS_UNIQUE_PLACEHOLDER
            ENUM_PLACEHOLDER
        })
        ${columNameVariants.camelCaseName}IS_REQUIRED_PLACEHOLDER: ${columnType[0]};
    `;

    await Promise.all(
        columnProperties.map((property) => {
            if (property === ColumnPropertyChoice.IS_REQUIRED) {
                replacements.push(
                    {
                        oldString: "IS_NULLABLE_PLACEHOLDER",
                        newString: "nullable: false,",
                    },
                    {
                        oldString: "IS_REQUIRED_PLACEHOLDER",
                        newString: "?",
                    }
                );
            } else if (property === ColumnPropertyChoice.IS_UNIQUE) {
                replacements.push({
                    oldString: "IS_UNIQUE_PLACEHOLDER",
                    newString: "unique: true,",
                });
            } else if (property === ColumnPropertyChoice.ENUM) {
                replacements.push({
                    oldString: "ENUM_PLACEHOLDER",
                    newString: "enum: ENUM_OBJECT,",
                });
            }
        })
    );

    // clean up the unused keys
    replacements.push(
        {
            oldString: "IS_NULLABLE_PLACEHOLDER",
            newString: "nullable: true,",
        },
        {
            oldString: "IS_REQUIRED_PLACEHOLDER",
            newString: "",
        },
        {
            oldString: "IS_UNIQUE_PLACEHOLDER",
            newString: "",
        },
        {
            oldString: "ENUM_PLACEHOLDER",
            newString: "",
        }
    );

    // add the column decorator with its properties
    entityAdditions.push({
        keyword: "// --- columns ---",
        replacements,
        addition: {
            base: entityBase,
            additionIsFile: false,
            conditional: {
                type: "SUPPOSED_TO_BE_THERE",
                data: columNameVariants.camelCaseName,
            },
        },
    });

    // --------------------
    // handle special cases
    // --------------------

    const specialReplacements: any = [];

    // handle the "Length" decorator
    if (columnDecorators.includes(ColumnDecoratorChoice.LENGTH))
        await inquirer
            .prompt([constants.createColumn.stringLength])
            .then(async ({ stringLength }) => {
                const [minimum, maximum] = stringLength.trim().split(",");
                specialReplacements.push(
                    {
                        oldString: "MIN_LENGTH",
                        newString: minimum,
                    },
                    {
                        oldString: "MAX_LENGTH",
                        newString: maximum,
                    }
                );
            });

    // handle the "ENUM" decorator
    if (columnProperties.includes(ColumnPropertyChoice.ENUM))
        await inquirer
            .prompt([constants.createColumn.enumName])
            .then(async ({ enumName }) => {
                specialReplacements.push({
                    oldString: "ENUM_OBJECT",
                    newString: enumName,
                });
            });

    // adding the decorators
    await Promise.all(
        columnDecorators.map((decorator) => {
            entityAdditions.push({
                keyword: "// --- decorators ---",
                addition: {
                    base: `\n${decoratorsMapObject[decorator].usage}`,
                    additionIsFile: false,
                },
                replacements: specialReplacements,
            });
            entityAdditions.push({
                keyword: "import { IsUUID",
                addition: {
                    base: `, ${decoratorsMapObject[decorator].name}`,
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: decoratorsMapObject[decorator].name,
                    },
                },
            });
        })
    );

    return entityAdditions;
};

export default getEntityAdditions;
