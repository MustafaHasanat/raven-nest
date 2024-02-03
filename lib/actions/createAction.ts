import { logNumberedList, specialLog } from "../utils/helpers/logHelpers.js";
import { CreateFileSetArgument, MemoCategory } from "../enums/actions.js";
import { execSync } from "child_process";
import installPackages from "../manipulator/installer.js";
import createMainBuilder from "../builder/createAction/createMainBuilder.js";
import constants from "../utils/constants/creatorConstants.js";
import createLandingPageBuilder from "../builder/createAction/createLandingPageBuilder.js";
import createAppFilesBuilder from "../builder/createAction/createAppFilesBuilder.js";
import createDatabaseBuilder from "../builder/createAction/createDatabaseBuilder.js";
import createTableBuilder from "../builder/createAction/createTableBuilder.js";
import createColumnBuilder from "../builder/createAction/createColumnBuilder.js";
import createRelationBuilder from "../builder/createAction/createRelationBuilder.js";
import { OptionValues } from "commander";
import { FullDependencies } from "../interfaces/constants.js";
import { checkMemo } from "../manipulator/memorizer.js";
import { MemoValues } from "../types/actions.js";

interface PreActionProps {
    deps?: FullDependencies | null;
    memos?: string[];
    builder: (memoValues: MemoValues) => Promise<void>;
}

const preAction = async ({
    deps = null,
    memos = [],
    builder,
}: PreActionProps) => {
    const memoValues = await checkMemo({
        keys: memos,
        category: MemoCategory.EAGLE_NEST,
    });
    if (!memoValues) return;

    deps && (await installPackages(deps));
    await builder(memoValues);
};

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

    const isNeedDeps = !["landing-page"].includes(filesSet);
    const installedDeps: string[] = [];

    // get a copy from the installed dependencies of the project
    // (only if the option needs some dependencies)
    if (isNeedDeps) {
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
    }

    switch (filesSet) {
        case CreateFileSetArgument.MAIN:
            await preAction({
                deps: {
                    installedDeps,
                    neededDeps: constants.neededDeps.main,
                },
                memos: ["projectName", "mainDest"],
                builder: (memoValues: MemoValues) =>
                    createMainBuilder(memoValues),
            });
            break;
        case CreateFileSetArgument.LANDING_PAGE:
            await preAction({
                memos: ["projectName", "publicDir"],
                builder: (memoValues: MemoValues) =>
                    createLandingPageBuilder(memoValues),
            });
            break;
        case CreateFileSetArgument.APP:
            await preAction({
                deps: {
                    installedDeps,
                    neededDeps: constants.neededDeps.app,
                },
                memos: ["projectName", "mainDest", "rootDir"],
                builder: (memoValues: MemoValues) =>
                    createAppFilesBuilder(memoValues, options),
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
