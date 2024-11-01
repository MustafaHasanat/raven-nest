import { CloneTemplate, InjectTemplate } from "engine";
import { logNumberedList, specialLog } from "../utils/helpers/logHelpers.js";
import injectTemplates from "./injector.js";
import cloneTemplates from "./cloner.js";
import { missingFiles } from "../utils/helpers/filesHelpers.js";
import { join } from "path";
import { execSync } from "child_process";
import { MemorizerProps, memorizeAction, memorizer } from "./memorizer.js";
import { ActionTag } from "actions";

interface ManipulatorProps {
    actionTag: ActionTag;
    injectionCommands?: InjectTemplate[];
    cloningCommands?: CloneTemplate[];
    memo?: MemorizerProps;
    overwrite: string[];
    skipOverwrite?: boolean;
}

interface ReturnManipulator {
    cloning: boolean;
    injection: boolean;
}

export default async function manipulator({
    actionTag,
    cloningCommands = [],
    injectionCommands = [],
    memo,
    overwrite,
    skipOverwrite = false,
}: ManipulatorProps): Promise<ReturnManipulator> {
    try {
        // memorize the selections
        memo && (await memorizer(memo));
        // check for missing files to inject. if any, terminate the command
        const injectableFiles = injectionCommands.reduce(
            (acc: string[], { injectable }) => [
                ...acc,
                join(process.cwd(), injectable),
            ],
            []
        );
        const missingFilesRes = missingFiles(injectableFiles);
        if (missingFilesRes.length > 0) {
            specialLog({
                message:
                    "You must have these files first so we can modify them",
                situation: "ERROR",
            });
            logNumberedList(missingFilesRes);
            return { cloning: false, injection: false };
        }
        // filter the cloning and injecting commands based on the user selection
        const filteredCloningCommands = cloningCommands.filter(
            ({ signature }) => overwrite.includes(signature)
        );
        const filteredInjectionCommands = injectionCommands.filter(
            ({ signature }) => overwrite.includes(signature)
        );
        // apply the cloning commands
        const isCloneDone =
            cloningCommands.length > 0
                ? await cloneTemplates(
                      skipOverwrite ? cloningCommands : filteredCloningCommands
                  )
                : true;
        if (!isCloneDone) return { cloning: false, injection: false };
        // apply the injection commands - only if the cloning stage was successful
        const isInjectDone =
            injectionCommands.length > 0
                ? await injectTemplates(
                      skipOverwrite
                          ? injectionCommands
                          : filteredInjectionCommands
                  )
                : true;
        // format the entire app using Prettier - only if the injection stage was successful
        if (isInjectDone) {
            execSync("npx prettier --write .");
            specialLog({
                situation: "RESULT",
                message: "All processes are done",
            });
            await memorizeAction(actionTag);
            return { cloning: true, injection: true };
        }
        return { cloning: isCloneDone, injection: isInjectDone };
    } catch (error) {
        specialLog({ situation: "ERROR", message: `${error}` });
        return { cloning: false, injection: false };
    }
}
