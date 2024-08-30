declare module "app" {
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
            init: CommandType;
            create: CommandTypeArgument & CommandTypeOption;
            dockerize: CommandType;
        };
        options?: {
            [option: string]: OptionType;
        };
    };

    type AppOptions = {
        aws?: string;
        mailer?: string;
        special?: "product" | "notification";
        mode?: "debug";
    };
}
