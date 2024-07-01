import { AppProps } from "lib/types/app";
import { join } from "path";

const appConstants: AppProps = {
    program: {
        name: "ravennest",
        description: "Build Nest.js common blocks and files insanely faster!",
        version: {
            number: "1.0.0",
            flags: "-v, --version",
            description: "Output the current version number",
        },
    },
    commands: {
        install: {
            command: "install",
            description:
                "Install the recommended dependencies if they're not installed.",
        },
        create: {
            command: "create",
            description:
                "Create the necessary files and directories for the selected 'files-set'.",
            argument: "<files-set>",
            options: {
                auth: {
                    flags: "--auth",
                    description: "Add a user-role auth to the app.",
                },
                format: {
                    flags: "--format",
                    description:
                        "Add the '.prettierrc' and '.eslintrc.js' files to the app.",
                },
                aws: {
                    flags: "--aws",
                    description: "Add the AWS service to the app.",
                },
                mailer: {
                    flags: "--mailer",
                    description: "Add a mailing service to the app.",
                },
                special: {
                    flags: "--special <table-name>",
                    description: "Create a special type of tables.",
                },
            },
        },
        dockerize: {
            command: "dockerize",
            description:
                "Configure docker images and containers for the server.",
        },
    },
};

export const getTemplatesDir = () => join("..", "templates");

export default appConstants;
