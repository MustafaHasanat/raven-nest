/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetColumnInjectionAdditions } from "../../../interfaces/builder.js";
import {
    ColumnPropertyChoice,
    ColumnTypeChoice,
} from "../../../enums/createAction.js";
import { decoratorsMapObject } from "../../../utils/constants/builderMapping.js";
import { InjectionAdditionAction } from "engine";

const getEntityAdditions = async ({
    columNameVariants,
    columnDecorators,
    columnProperties,
    columnType,
    defaultValue,
    specialReplacements,
}: GetColumnInjectionAdditions): Promise<InjectionAdditionAction[]> => {
    const entityAdditions: InjectionAdditionAction[] = [];
    const replacements: any = [];

    // get the default value
    let specialDefault = `"${defaultValue || "''"}"`;

    if (columnType === ColumnTypeChoice.TIME)
        specialDefault = "'new Date().toLocaleTimeString()'";

    if (columnType === ColumnTypeChoice.ENUM)
        specialDefault = "'ENUM_OBJECT.SELECT_OPTION'";

    // create a base component
    const entityBase = `
        // --- decorators ---
        @Column({
            type: "${columnType === "string" ? "text" : columnType}",
            default: ${specialDefault},
            IS_NULLABLE_PLACEHOLDER
            IS_UNIQUE_PLACEHOLDER
            ENUM_PLACEHOLDER
        })
        ${columNameVariants.camelCaseName}IS_REQUIRED_PLACEHOLDER: TYPE_PLACEHOLDER;
    `;

    // handle the properties
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
                        newString: "",
                    }
                );
            } else if (property === ColumnPropertyChoice.IS_UNIQUE) {
                replacements.push({
                    oldString: "IS_UNIQUE_PLACEHOLDER",
                    newString: "unique: true,",
                });
            } else if (property === ColumnPropertyChoice.ENUM) {
                replacements.push(
                    {
                        oldString: "ENUM_PLACEHOLDER",
                        newString: "enum: ENUM_OBJECT,",
                    },
                    {
                        oldString: "TYPE_PLACEHOLDER",
                        newString: "ENUM_OBJECT",
                    }
                );
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
            newString: "?",
        },
        {
            oldString: "IS_UNIQUE_PLACEHOLDER",
            newString: "",
        },
        {
            oldString: "ENUM_PLACEHOLDER",
            newString: "",
        },
        {
            oldString: "TYPE_PLACEHOLDER",
            newString: columnType,
        }
    );

    // add the column decorator with its properties
    entityAdditions.push({
        keyword: "// --- columns ---",
        replacements: [...replacements, ...specialReplacements],
        addition: {
            base: entityBase,
            additionIsFile: false,
            conditional: {
                type: "SUPPOSED_TO_BE_THERE",
                data: `${columNameVariants.camelCaseName}IS_REQUIRED_PLACEHOLDER: ${columnType};`,
            },
        },
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
        })
    );

    return entityAdditions;
};

export default getEntityAdditions;
