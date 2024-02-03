type OptionType = {
    flags: string;
    description: string;
};

type CommandType = {
    command: string;
    description: string;
};

type CommandTypeArgument = CommandType & {
    argument: string;
};

type CommandTypeOption = CommandType & {
    options: {
        [option: string]: OptionType;
    };
};

type AppProps = {
    program: {
        name: string;
        description: string;
        version: {
            number: string;
            flags: string;
            description: string;
        };
    };
    commands: {
        install: CommandType;
        create: CommandTypeArgument & CommandTypeOption;
        docker: CommandTypeArgument;
    };
    options?: {
        [option: string]: OptionType;
    };
};

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
        docker: {
            command: "docker",
            description:
                "Configure docker images and containers for the server.",
            argument: "<files-set>",
        },
    },
};

export default appConstants;
