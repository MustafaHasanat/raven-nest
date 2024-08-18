/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetColumnInjectionAdditions } from "../../../interfaces/builder.js";
import { ColumnPropertyChoice } from "../../../enums/createAction.js";
import { decoratorsMapObject } from "../../constants/builderMapping.js";
import { InjectionAdditionAction } from "engine";

const getCreateDtoAdditions = async ({
    columNameVariants,
    columnDecorators,
    columnProperties,
    columnType,
    defaultValue,
    description,
    example,
    specialReplacements,
}: GetColumnInjectionAdditions): Promise<InjectionAdditionAction[]> => {
    const createDtoAdditions: InjectionAdditionAction[] = [];
    const replacements: any = [];

    // create a base component
    const dtoBase = `
        // --- decorators ---
        @ApiProperty({
            required: IS_REQUIRED_PLACEHOLDER,
            ${defaultValue ? `default: "${defaultValue}",` : ""}
            ${example ? `example: "${example}",` : ""}
            ${description ? `description: "${description}",` : ""}
            ENUM_PLACEHOLDER
        })
        ${columNameVariants.camelCaseName}IS_REQUIRED_SIGN_PLACEHOLDER: ${columnType};
    `;

    // handle the properties
    await Promise.all(
        columnProperties.map((property) => {
            if (property === ColumnPropertyChoice.IS_REQUIRED) {
                replacements.push(
                    {
                        oldString: "IS_REQUIRED_PLACEHOLDER",
                        newString: "true",
                    },
                    {
                        oldString: "IS_REQUIRED_SIGN_PLACEHOLDER",
                        newString: "",
                    }
                );
            } else if (property === ColumnPropertyChoice.ENUM) {
                replacements.push(
                    {
                        oldString: "ENUM_PLACEHOLDER",
                        newString: "enum: ENUM_OBJECT,",
                    },
                    {
                        oldString: `: ${columnType};`,
                        newString: ": ENUM_OBJECT;",
                    }
                );
            }
        })
    );

    // clean up the unused keys
    replacements.push(
        {
            oldString: "IS_REQUIRED_PLACEHOLDER",
            newString: "false",
        },
        {
            oldString: "IS_REQUIRED_SIGN_PLACEHOLDER",
            newString: "?",
        },
        {
            oldString: "ENUM_PLACEHOLDER",
            newString: "",
        }
    );

    // add the column decorator with its properties
    createDtoAdditions.push({
        keyword: "// --- Original fields ---",
        replacements: [...replacements, ...specialReplacements],
        addition: {
            base: dtoBase,
            additionIsFile: false,
            conditional: {
                type: "SUPPOSED_TO_BE_THERE",
                data: columNameVariants.camelCaseName,
            },
        },
    });

    // adding the decorators
    await Promise.all(
        columnDecorators.map((decorator) => {
            createDtoAdditions.push({
                keyword: "// --- decorators ---",
                addition: {
                    base: `\n${decoratorsMapObject[decorator].usage}`,
                    additionIsFile: false,
                },
                replacements: specialReplacements,
            });
        })
    );

    return createDtoAdditions;
};

export default getCreateDtoAdditions;
