/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from "path";
import { CloneTemplate } from "../../types/cloneTemplate.js";
import { InjectTemplate } from "../../types/injectTemplate.js";
import { generateJWTSecret } from "../../utils/helpers/filesHelpers.js";
import { CreateMainProps } from "../../interfaces/builder.js";

export const createMainCloning = ({
    rootDir,
    isAWS,
    publicDir,
    projectName,
    mainDest,
    schemasPath,
}: CreateMainProps): CloneTemplate[] => [
    // public files
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
    // main and app files
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
    // auth files
    {
        signature: "auth.module.ts",
        target: "base/typescript/auth/auth.module.txt",
        destination: join(schemasPath, "auth"),
        newFileName: "auth.module.ts",
    },
    {
        signature: "auth.controller.ts",
        target: "base/typescript/auth/auth.controller.txt",
        destination: join(schemasPath, "auth"),
        newFileName: "auth.controller.ts",
    },
    {
        signature: "auth.service.ts",
        target: "base/typescript/auth/auth.service.txt",
        destination: join(schemasPath, "auth"),
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
    // extra files
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
    {
        signature: "Makefile",
        target: "base/others/Makefile.txt",
        destination: rootDir,
        newFileName: "Makefile",
    },
    ...(isAWS
        ? [
              {
                  signature: "aws.module.ts",
                  target: "base/typescript/aws/aws.module.txt",
                  destination: join(schemasPath, "aws"),
                  newFileName: "aws.module.ts",
              },
              {
                  signature: "aws.controller.ts",
                  target: "base/typescript/aws/aws.controller.txt",
                  destination: join(schemasPath, "aws"),
                  newFileName: "aws.controller.ts",
              },
              {
                  signature: "aws.service.ts",
                  target: "base/typescript/aws/aws.service.txt",
                  destination: join(schemasPath, "aws"),
                  newFileName: "aws.service.ts",
              },
          ]
        : []),
];

export const createMainInjection = ({
    rootDir,
    isAWS,
    isMailer,
    mainDest,
}: CreateMainProps): InjectTemplate[] =>
    [
        // extra files
        {
            signature: "app.module.ts",
            injectable: join(mainDest, "app.module.ts"),
            additions: [
                ...(isAWS
                    ? [
                          {
                              addition: {
                                  base: 'import { S3Module } from "./schemas/aws/aws.module";\n',
                                  additionIsFile: false,
                                  conditional: {
                                      type: "SUPPOSED_TO_BE_THERE",
                                      data: "S3Module",
                                  },
                              },
                              keyword: "*",
                          },
                          {
                              addition: {
                                  base: "\n// --- AWS-S3 ---\nS3Module,",
                                  additionIsFile: false,
                                  conditional: {
                                      type: "SUPPOSED_TO_BE_THERE",
                                      data: "// --- AWS-S3 ---",
                                  },
                              },
                              keyword: "// ===== services =====",
                          },
                      ]
                    : []),
                ...(isMailer
                    ? [
                          {
                              keyword: "*",
                              addition: {
                                  base: 'import { MailerModule } from "@nestjs-modules/mailer";\n',
                                  additionIsFile: false,
                                  conditional: {
                                      type: "SUPPOSED_TO_BE_THERE",
                                      data: "MailerModule",
                                  },
                              },
                          },
                          {
                              keyword: "// ===== services =====",
                              addition: {
                                  base: "components/typescript/service/mailer.txt",
                                  conditional: {
                                      type: "SUPPOSED_TO_BE_THERE",
                                      data: "// --- mailer ---",
                                  },
                              },
                          },
                      ]
                    : []),
            ],
        },
        {
            signature: ".env",
            injectable: join(rootDir, ".env"),
            additions: [
                {
                    keyword: "*",
                    addition: {
                        base: `\nJWT_SECRET=${generateJWTSecret()}\n`,
                        additionIsFile: false,
                        conditional: {
                            type: "SUPPOSED_TO_BE_THERE",
                            data: "JWT_SECRET",
                        },
                    },
                },
                {
                    keyword: "*",
                    addition: {
                        base: "components/others/app-env.txt",
                        conditional: {
                            type: "SUPPOSED_TO_BE_THERE",
                            data: "PORT=8000",
                        },
                    },
                },
                ...(isAWS
                    ? [
                          {
                              keyword: "*",
                              addition: {
                                  base: "\nAWS_ACCESS_KEY=***\nAWS_SECRET_ACCESS_KEY=***\nAWS_REGION=us-east-1\nS3_BUCKET_NAME=***\n",
                                  additionIsFile: false,
                                  conditional: {
                                      type: "SUPPOSED_TO_BE_THERE",
                                      data: "AWS_ACCESS_KEY",
                                  },
                              },
                          },
                      ]
                    : []),
                ...(isMailer
                    ? [
                          {
                              keyword: "*",
                              addition: {
                                  base: '\nOFFICIAL_EMAIL="exampe@gmail.com"\nOFFICIAL_EMAIL_PASSWORD="***"\nMAILER_SERVICE_PROVIDER=hotmail\n',
                                  additionIsFile: false,
                                  conditional: {
                                      type: "SUPPOSED_TO_BE_THERE",
                                      data: "nMAILER_SERVICE_PROVIDER",
                                  },
                              },
                          },
                      ]
                    : []),
            ],
        },
        {
            signature: "package.json",
            injectable: join(rootDir, "package.json"),
            prioritize: "deletion",
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
            additions: [
                {
                    keyword: '"scripts": {',
                    addition: {
                        base: '"format": "prettier --write .",',
                        additionIsFile: false,
                    },
                },
            ],
        },
    ] as InjectTemplate[];
