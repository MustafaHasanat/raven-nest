#! /usr/bin/env node

"use strict";

import { Argument, Command, Option } from "commander";
import constants from "./lib/utils/constants/app.js";
import createAction from "./lib/actions/create.js";
import dockerizeAction from "./lib/actions/dockerize.js";
import { isNodeProject } from "./lib/middlewares/isNodeProject.js";
import defaultAction from "./lib/actions/default.js";
import initAction from "./lib/actions/init.js";
import {
    CreateFileSetArgument,
    CreateSpecialArgument,
    RuntimeMode,
} from "./lib/enums/actions.js";
import { AppOptions } from "app";
import { handleDebugger } from "./lib/middlewares/debugger.js";

export default function InitAction() {
    // Initialize the cli-tool program
    const program = new Command();
    const options = program.opts();

    // configure the program initialization
    program
        .name(constants.program.name)
        .version(
            constants.program.version.number,
            constants.program.version.flags,
            constants.program.version.description
        )
        .description(constants.program.description);

    // configure the init command
    program
        .command(constants.commands.init.command)
        .description(constants.commands.init.description)
        .action(async (options: AppOptions) => {
            isNodeProject();
            await handleDebugger(options);
            await initAction();
        });

    // configure the docker command
    program
        .command(constants.commands.dockerize.command)
        .description(constants.commands.dockerize.description)
        .action(async (options: AppOptions) => {
            isNodeProject();
            await handleDebugger(options);
            await dockerizeAction();
        });

    // configure the create command
    program
        .command(constants.commands.create.command)
        .description(constants.commands.create.description)
        .addArgument(
            new Argument(constants.commands.create.argument).choices(
                Object.values(CreateFileSetArgument)
            )
        )
        .addOption(
            new Option(
                constants.commands.create.options.aws.flags,
                constants.commands.create.options.aws.description
            )
        )
        .addOption(
            new Option(
                constants.commands.create.options.mailer.flags,
                constants.commands.create.options.mailer.description
            )
        )
        .addOption(
            new Option(
                constants.commands.create.options.special.flags,
                constants.commands.create.options.special.description
            ).choices(Object.values(CreateSpecialArgument))
        )
        .addOption(
            new Option(
                constants.commands.create.options.mode.flags,
                constants.commands.create.options.mode.description
            ).choices(Object.values(RuntimeMode))
        )
        .action(
            async (filesSet: CreateFileSetArgument, options: AppOptions) => {
                isNodeProject();
                await handleDebugger(options);
                await createAction(filesSet, options);
            }
        );

    // configure the default entry (the empty command)
    program.action(() => {
        defaultAction(program, options);
    });

    // parsing the arguments
    program.parse(process.argv);
}

InitAction();
