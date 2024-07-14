/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from "path";
import { CloneTemplate } from "../../types/cloneTemplate.js";
import { InjectTemplate } from "../../types/injectTemplate.js";
import { generateJWTSecret } from "../../utils/helpers/filesHelpers.js";

interface CreateMainProps {
    mainDest: string;
    rootDir: string;
    projectName: string;
    isAWS: boolean;
    isMailer: boolean;
    publicDir: string;
}

export const createMainCloning = ({
    mainDest,
    rootDir,
    isAWS,
    projectName,
    publicDir,
}: CreateMainProps): CloneTemplate[] => [
    {
        signature: "public/index.html",
        target: "base/html/landing-page.txt",
        destination: publicDir,
        newFileName: "index.html",
        replacements: [
            {
                oldString: "PROJECT_NAME",
                newString: projectName,
            },
        ],
    },
    {
        signature: "public/styles/main.css",
        target: "base/css/landing-page.txt",
        destination: join(publicDir, "styles"),
        newFileName: "main.css",
    },
    {
        signature: "main.ts",
        target: "base/typescript/app/main-file.txt",
        destination: mainDest,
        newFileName: "main.ts",
        replacements: [
            {
                oldString: "PROJECT_NAME",
                newString: projectName,
            },
        ],
    },
    {
        signature: "app.module.ts",
        target: "base/typescript/app/module-file.txt",
        destination: mainDest,
        newFileName: "app.module.ts",
    },
    {
        signature: "app.controller.ts",
        target: "base/typescript/app/controller-file.txt",
        destination: mainDest,
        newFileName: "app.controller.ts",
    },
    {
        signature: "app.service.ts",
        target: "base/typescript/app/service-file.txt",
        destination: mainDest,
        newFileName: "app.service.ts",
    },

    {
        signature: "user-auth.guard.ts",
        target: "base/typescript/jwt/auth-guard-file.txt",
        destination: join(mainDest, "guards"),
        newFileName: "user-auth.guard.ts",
    },
    {
        signature: "auth.module.ts",
        target: "base/typescript/auth/auth.module.txt",
        destination: join(mainDest, "auth"),
        newFileName: "auth.module.ts",
    },
    {
        signature: "auth.controller.ts",
        target: "base/typescript/auth/auth.controller.txt",
        destination: join(mainDest, "auth"),
        newFileName: "auth.controller.ts",
    },
    {
        signature: "auth.service.ts",
        target: "base/typescript/auth/auth.service.txt",
        destination: join(mainDest, "auth"),
        newFileName: "auth.service.ts",
    },
    {
        signature: "passwordRequest.hbs",
        target: "base/html/passwordRequest.txt",
        destination: join(rootDir, "views"),
        newFileName: "passwordRequest.hbs",
        replacements: [
            {
                oldString: "PROJECT_NAME",
                newString: projectName,
            },
        ],
    },
    {
        signature: "passwordReset.hbs",
        target: "base/html/passwordReset.txt",
        destination: join(rootDir, "views"),
        newFileName: "passwordReset.hbs",
    },
    {
        signature: "passwordReset.css",
        target: "base/css/passwordReset.txt",
        destination: join(rootDir, "public", "styles"),
        newFileName: "passwordReset.css",
    },
    {
        signature: "validation.js",
        target: "base/js/pass-validation.txt",
        destination: join(rootDir, "public", "scripts"),
        newFileName: "validation.js",
    },
    {
        signature: ".prettierrc",
        target: "base/others/prettierrc-file.txt",
        destination: rootDir,
        newFileName: ".prettierrc",
    },
    {
        signature: ".eslintrc.js",
        target: "base/others/eslintrc-file.txt",
        destination: rootDir,
        newFileName: ".eslintrc.js",
    },
    ...(isAWS
        ? [
              {
                  signature: "aws.module.ts",
                  target: "base/typescript/aws/aws.module.txt",
                  destination: join(mainDest, "aws"),
                  newFileName: "aws.module.ts",
              },
              {
                  signature: "aws.controller.ts",
                  target: "base/typescript/aws/aws.controller.txt",
                  destination: join(mainDest, "aws"),
                  newFileName: "aws.controller.ts",
              },
              {
                  signature: "aws.service.ts",
                  target: "base/typescript/aws/aws.service.txt",
                  destination: join(mainDest, "aws"),
                  newFileName: "aws.service.ts",
              },
          ]
        : []),
];

export const createMainInjection = ({
    mainDest,
    rootDir,
    isAWS,
    isMailer,
}: CreateMainProps): InjectTemplate[] =>
    [
        // {
        //     signature: "app.module.ts",
        //     injectable: join(mainDest, "app.module.ts"),
        //     additions: [
        //         {
        //             keyword: "*",
        //             addition: {
        //                 base: "import { UserAuthGuard } from './guards/user-auth.guard'\nimport { APP_GUARD } from '@nestjs/core';\nimport { JwtModule } from '@nestjs/jwt';\nimport { AuthModule } from './auth/auth.module';\n",
        //                 additionIsFile: false,
        //             },
        //         },
        //         {
        //             keyword: "// ===== services =====",
        //             addition: {
        //                 base: "components/typescript/jwt/main-configs.txt",
        //             },
        //         },
        //         {
        //             keyword: "providers: [",
        //             addition: {
        //                 base: "\n{\nprovide: APP_GUARD,\nuseClass: UserAuthGuard,\n},\n",
        //                 additionIsFile: false,
        //             },
        //         },
        //         ...(isAWS
        //             ? [
        //                   {
        //                       addition: {
        //                           base: 'import { S3Module } from "./aws/aws.module";\n',
        //                           additionIsFile: false,
        //                       },
        //                       keyword: "*",
        //                   },
        //                   {
        //                       addition: {
        //                           base: "\n// --- AWS-S3 ---\nS3Module,",
        //                           additionIsFile: false,
        //                       },
        //                       keyword: "// ===== services =====",
        //                   },
        //               ]
        //             : []),
        //         ...(isMailer
        //             ? [
        //                   {
        //                       keyword: "*",
        //                       addition: {
        //                           base: 'import { MailerModule } from "@nestjs-modules/mailer";\n',
        //                           additionIsFile: false,
        //                       },
        //                   },
        //                   {
        //                       keyword: "// ===== services =====",
        //                       addition: {
        //                           base: "components/typescript/service/mailer.txt",
        //                       },
        //                   },
        //               ]
        //             : []),
        //     ],
        // },
        // {
        //     signature: ".env",
        //     injectable: join(rootDir, ".env"),
        //     additions: [
        //         {
        //             keyword: "*",
        //             addition: {
        //                 base: `\nJWT_SECRET=${generateJWTSecret()}\n`,
        //                 additionIsFile: false,
        //                 conditional: {
        //                     type: "SUPPOSED_TO_BE_THERE",
        //                     data: "JWT_SECRET",
        //                 },
        //             },
        //         },
        //         {
        //             keyword: "*",
        //             addition: {
        //                 base: "components/others/app-env.txt",
        //                 conditional: {
        //                     type: "SUPPOSED_TO_BE_THERE",
        //                     data: "PORT=8000",
        //                 },
        //             },
        //         },
        //         ...(isAWS
        //             ? [
        //                   {
        //                       keyword: "*",
        //                       addition: {
        //                           base: "\nAWS_ACCESS_KEY=***\nAWS_SECRET_ACCESS_KEY=***\nAWS_REGION=us-east-1\nS3_BUCKET_NAME=***\n",
        //                           additionIsFile: false,
        //                       },
        //                   },
        //               ]
        //             : []),
        //         ...(isMailer
        //             ? [
        //                   {
        //                       keyword: "*",
        //                       addition: {
        //                           base: '\nOFFICIAL_EMAIL="exampe@gmail.com"\nOFFICIAL_EMAIL_PASSWORD="***"\nMAILER_SERVICE_PROVIDER=hotmail\n',
        //                           additionIsFile: false,
        //                       },
        //                   },
        //               ]
        //             : []),
        //     ],
        // },
        {
            signature: "package.json",
            injectable: join(rootDir, "package.json"),
            deletions: [
                {
                    keyword: '"format"',
                    deletion: {
                        isWholeLine: true,
                        conditional: {
                            type: "REPLACED_WITH",
                            data: '"format": "prettier --write .",',
                            special: "INDEX_CUT",
                        },
                    },
                },
            ],
        },
    ] as InjectTemplate[];
