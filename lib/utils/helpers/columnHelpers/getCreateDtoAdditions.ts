/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetColumnInjectionAdditions } from "../../../interfaces/builder.js";
import {
    ColumnDecoratorChoice,
    ColumnPropertyChoice,
    ColumnTypeChoice,
} from "../../../enums/createAction.js";
import { decoratorsMapObject } from "../../constants/builderMapping.js";
import inquirer from "inquirer";
import constants from "../../constants/builderConstants.js";
import { InjectionAdditionAction } from "engine";

const getCreateDtoAdditions = async ({
    columNameVariants,
    columnDecorators,
    columnProperties,
    columnType,
    defaultValue,
}: GetColumnInjectionAdditions): Promise<InjectionAdditionAction[]> => {
    const createDtoAdditions: InjectionAdditionAction[] = [];

    return createDtoAdditions;
};

export default getCreateDtoAdditions;
