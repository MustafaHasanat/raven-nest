#! /usr/bin/env node
"use strict";

import { Argument, Command, Option, OptionValues } from "commander";
import constants from "./lib/utils/constants/app.js";
import createAction from "./lib/actions/create.js";
import dockerizeAction from "./lib/actions/dockerize.js";
import { isNodeProject } from "./lib/middlewares/isNodeProject.js";
import defaultAction from "./lib/actions/default.js";
import initAction from "./lib/actions/init.js";
import {
    CreateFileSetArgument,
    CreateSpecialArgument,
} from "./lib/enums/actions.js";

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
        .action(async () => {
            isNodeProject();
            await initAction();
        });

    // configure the docker command
    program
        .command(constants.commands.dockerize.command)
        .description(constants.commands.dockerize.description)
        .action(async () => {
            isNodeProject();
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
        .action(
            async (filesSet: CreateFileSetArgument, options: OptionValues) => {
                isNodeProject();
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
