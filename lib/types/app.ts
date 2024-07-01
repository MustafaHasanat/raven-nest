export type OptionType = {
    flags: string;
    description: string;
};

export type CommandType = {
    command: string;
    description: string;
};

export type CommandTypeArgument = CommandType & {
    argument: string;
};

export type CommandTypeOption = CommandType & {
    options: {
        [option: string]: OptionType;
    };
};

export type AppProps = {
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
        dockerize: CommandType;
    };
    options?: {
        [option: string]: OptionType;
    };
};
