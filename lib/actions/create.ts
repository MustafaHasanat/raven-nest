import { logNumberedList, specialLog } from "../utils/helpers/logHelpers.js";
import { CreateFileSetArgument } from "../enums/actions.js";
import { execSync } from "child_process";
import createMainBuilder from "../builder/create/createMainBuilder.js";
import constants from "../utils/constants/creator.js";
import createDatabaseBuilder from "../builder/create/createDatabaseBuilder.js";
import createTableBuilder from "../builder/create/createTableBuilder.js";
import createColumnBuilder from "../builder/create/createColumnBuilder.js";
import createRelationBuilder from "../builder/create/createRelationBuilder.js";
import { OptionValues } from "commander";
import { MemoValues } from "actions";
import { preAction } from "../utils/helpers/preActionProcesses.js";

export default async function createAction(
    filesSet: CreateFileSetArgument,
    options: OptionValues
) {
    const availableFilesSets = Object.values(CreateFileSetArgument);

    if (!availableFilesSets.includes(filesSet)) {
        specialLog({
            message: `Invalid argument "${filesSet}", you can only choose one of the allowed values\n`,
            situation: "ERROR",
            scope: "argument",
        });
        logNumberedList(availableFilesSets);
        return;
    }

    const installedDeps: string[] = [];

    // get a copy from the installed dependencies of the project
    specialLog({
        message: "Checking your dependencies",
        situation: "PROCESS",
    });
    installedDeps.push(
        ...execSync("npm ls --depth=0")
            .toString()
            .split(" ")
            .slice(2)
            .map((item) => item.slice(0, item.lastIndexOf("@")))
    );

    switch (filesSet) {
        case CreateFileSetArgument.MAIN:
            await preAction({
                deps: {
                    installedDeps,
                    neededDeps: constants.neededDeps.main,
                },
                memos: ["projectName", "mainDest", "publicDir", "rootDir"],
                builder: (memoValues: MemoValues) =>
                    createMainBuilder(memoValues, options),
            });
            break;
        case CreateFileSetArgument.DATABASE:
            await preAction({
                deps: {
                    installedDeps,
                    neededDeps: constants.neededDeps.database,
                },
                memos: ["mainDest", "rootDir"],
                builder: (memoValues: MemoValues) =>
                    createDatabaseBuilder(memoValues),
            });
            break;
        case CreateFileSetArgument.TABLE:
            await preAction({
                deps: {
                    installedDeps,
                    neededDeps: constants.neededDeps.table,
                },
                memos: ["mainDest"],
                builder: (memoValues: MemoValues) =>
                    createTableBuilder(memoValues, options),
            });
            break;
        case CreateFileSetArgument.COLUMN:
            await preAction({
                deps: {
                    installedDeps,
                    neededDeps: constants.neededDeps.column,
                },
                memos: ["mainDest"],
                builder: (memoValues: MemoValues) =>
                    createColumnBuilder(memoValues),
            });
            break;
        case CreateFileSetArgument.RELATION:
            await preAction({
                deps: {
                    installedDeps,
                    neededDeps: constants.neededDeps.relation,
                },
                memos: ["mainDest"],
                builder: (memoValues: MemoValues) =>
                    createRelationBuilder(memoValues),
            });
            break;
        default:
            break;
    }
}
