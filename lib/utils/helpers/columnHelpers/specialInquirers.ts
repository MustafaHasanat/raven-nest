import inquirer from "inquirer";
import constants from "../../constants/builderConstants.js";
import NameVariant from "../../../models/nameVariant.js";
import { join } from "path";
import { ColumnDecoratorChoice } from "../../../enums/createAction.js";
import SubPath from "../../../models/subPath.js";
import { CloneTemplate } from "engine";

export const lengthDecoratorHandler = async () => {
    const replacements: {
        oldString: string;
        newString: string;
    }[] = [];

    await inquirer
        .prompt([constants.createColumn.stringLength])
        .then(async ({ stringLength }) => {
            const [minimum, maximum] = stringLength.trim().split(",");
            replacements.push(
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

    return replacements;
};

export const enumDecoratorHandler = async ({
    subPathObj,
    tableNameVariantObj,
    columnNameVariantObj,
}: {
    subPathObj: SubPath;
    tableNameVariantObj: NameVariant;
    columnNameVariantObj: NameVariant;
}) => {
    const replacements: any[] = [];
    const decorators: ColumnDecoratorChoice[] = [];
    const commands: CloneTemplate[] = [];
    const enumInfo: {
        name: string;
        values: string;
    } = { name: "", values: "" };

    await inquirer
        .prompt([
            constants.createColumn.enumName,
            constants.createColumn.enumValues,
        ])
        .then(async ({ enumName, enumValues }) => {
            replacements.push({
                oldString: "ENUM_OBJECT",
                newString: enumName,
            });
            decorators.push("isEnum" as ColumnDecoratorChoice);

            const values = (enumValues as string)
                .split(",")
                .map((item) => {
                    const itemVariant = new NameVariant(item);
                    return `${itemVariant.upperSnakeCaseName} = '${itemVariant.camelCaseName}'`;
                })
                .join(",");

            enumInfo["name"] = enumName
            enumInfo["values"] = enumValues

            commands.push({
                signature: "new-enum.enum.ts",
                target: "base/typescript/enum/file-enum.txt",
                destination: join(subPathObj.enumsPath),
                newFileName: `${tableNameVariantObj.camelCaseName}-${columnNameVariantObj.camelCaseName}-${enumName}.enum.ts`,
                replacements: [
                    {
                        oldString: "ENUM_NAME",
                        newString: enumName,
                    },
                    {
                        oldString: "ENUM_VALUE_PLACEHOLDER",
                        newString: values,
                    },
                ],
            });
        });

    return {
        replacements,
        decorators,
        commands,
        enumInfo,
    };
};
