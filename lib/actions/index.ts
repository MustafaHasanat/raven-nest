import { Argument, Command, Option, OptionValues } from "commander";
import constants from "../utils/constants/appConstants.js";
import createAction from "../actions/createAction.js";
import dockerAction from "../actions/dockerAction.js";
import { isNodeProject } from "../middlewares/isNodeProject.js";
import defaultAction from "../actions/defaultAction.js";
import installAction from "../actions/installAction.js";
import {
    CreateFileSetArgument,
    CreateSpecialArgument,
    DockerFileSetArgument,
} from "../enums/actions.js";

const {
    program: {
        name: programName,
        description: programDescription,
        version: {
            number: versionNumber,
            flags: versionFlags,
            description: versionDescription,
        },
    },
    commands: {
        install: { command: installCommand, description: installDescription },
        create: {
            command: createCommand,
            description: createDescription,
            argument: createArgument,
            options: {
                auth: {
                    flags: createFlagsAuth,
                    description: createDescriptionAuth,
                },
                format: {
                    flags: createFlagsFormat,
                    description: createDescriptionFormat,
                },
                aws: {
                    flags: createFlagsAWS,
                    description: createDescriptionAWS,
                },
                special: {
                    flags: createFlagsSpecial,
                    description: createDescriptionSpecial,
                },
                mailer: {
                    flags: createFlagsMailer,
                    description: createDescriptionMailer,
                },
            },
        },
        docker: {
            command: dockerCommand,
            description: dockerDescription,
            argument: dockerArgument,
        },
    },
} = constants;

export default function InitAction() {
    // Initialize the cli-tool program
    const program = new Command();
    const options = program.opts();

    program
        .name(programName)
        .version(versionNumber, versionFlags, versionDescription)
        .description(programDescription);

    program
        .command(installCommand)
        .description(installDescription)
        .action(async () => {
            isNodeProject();
            await installAction();
        });

    program
        .command(createCommand)
        .description(createDescription)
        .addArgument(
            new Argument(createArgument).choices(
                Object.values(CreateFileSetArgument)
            )
        )
        .addOption(new Option(createFlagsAuth, createDescriptionAuth))
        .addOption(new Option(createFlagsFormat, createDescriptionFormat))
        .addOption(new Option(createFlagsAWS, createDescriptionAWS))
        .addOption(new Option(createFlagsMailer, createDescriptionMailer))
        .addOption(
            new Option(createFlagsSpecial, createDescriptionSpecial).choices(
                Object.values(CreateSpecialArgument)
            )
        )
        .action(
            async (filesSet: CreateFileSetArgument, options: OptionValues) => {
                isNodeProject();
                await createAction(filesSet, options);
            }
        );

    program
        .command(dockerCommand)
        .description(dockerDescription)
        .addArgument(
            new Argument(dockerArgument).choices(
                Object.values(DockerFileSetArgument)
            )
        )
        .action(async (filesSet: DockerFileSetArgument) => {
            isNodeProject();
            await dockerAction(filesSet);
        });

    program.action(() => {
        defaultAction(program, options);
    });

    program.parse(process.argv);
}
