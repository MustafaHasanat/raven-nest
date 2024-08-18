/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetColumnInjectionAdditions } from "../../../interfaces/builder.js";
import { ColumnPropertyChoice } from "../../../enums/createAction.js";
import { InjectionAdditionAction } from "engine";

const getUpdateDtoAdditions = async ({
    columNameVariants,
    columnProperties,
    columnType,
    specialReplacements,
}: GetColumnInjectionAdditions): Promise<InjectionAdditionAction[]> => {
    const updateDtoAdditions: InjectionAdditionAction[] = [];
    const replacements: any = [];

    // create a base component
    const dtoBase = `
        @cv.IsOptional()
        @ApiProperty({ required: false })
        ${columNameVariants.camelCaseName}?: TYPE_PLACEHOLDER;
    `;

    // handle the properties
    await Promise.all(
        columnProperties.map((property) => {
            if (property === ColumnPropertyChoice.ENUM) {
                replacements.push({
                    oldString: "TYPE_PLACEHOLDER",
                    newString: "ENUM_OBJECT",
                });
            }
        })
    );

    // clean up the unused keys
    replacements.push({
        oldString: "TYPE_PLACEHOLDER",
        newString: columnType,
    });

    // add the column decorator with its properties
    updateDtoAdditions.push({
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

    return updateDtoAdditions;
};

export default getUpdateDtoAdditions;
