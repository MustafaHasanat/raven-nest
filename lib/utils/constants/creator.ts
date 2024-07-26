import { QuestionCollection } from "inquirer";
import { CreatorConstantsPros } from "../../interfaces/constants.js";

const creatorConstants: CreatorConstantsPros = {
    installer: {
        confirmation: (
            packages: string,
            count: number
        ): QuestionCollection => ({
            name: `confirmation`,
            message: `Some packages aren't installed (${count} package/s), do you want us to take care of this?\n${packages}`,
            type: "confirm",
            default: true,
        }),
    },
    neededDeps: {
        main: [
            { packageName: "@nestjs/core", commandType: "--save" },
            {
                packageName: "@nestjs/platform-express",
                commandType: "--save",
            },
            { packageName: "@nestjs/swagger", commandType: "--save" },
            { packageName: "@nestjs/common", commandType: "--save" },
            { packageName: "@nestjs/core", commandType: "--save" },
            { packageName: "@nestjs/jwt", commandType: "--save" },
            { packageName: "@nestjs-modules/mailer", commandType: "--save" },
            { packageName: "@nestjs/config", commandType: "--save" },
            { packageName: "@nestjs-modules/mailer", commandType: "--save" },
            { packageName: "@aws-sdk/client-s3", commandType: "--save" },
            { packageName: "@aws-sdk/s3-request-presigner", commandType: "--save" },
        ],
        database: [
            { packageName: "@nestjs/config", commandType: "--save" },
            { packageName: "@nestjs/typeorm", commandType: "--save" },
            { packageName: "@nestjs/jwt", commandType: "--save" },
        ],
        table: [
            { packageName: "typeorm", commandType: "--save" },
            { packageName: "class-validator", commandType: "--save" },
            { packageName: "@nestjs/swagger", commandType: "--save" },
            { packageName: "@nestjs/common", commandType: "--save" },
            { packageName: "@nestjs/typeorm", commandType: "--save" },
            { packageName: "@types/express", commandType: "--save-dev" },
        ],
        column: [
            { packageName: "class-validator", commandType: "--save" },
            { packageName: "typeorm", commandType: "--save" },
        ],
        relation: [{ packageName: "@nestjs/swagger", commandType: "--save" }],
    },
};

export default creatorConstants;
