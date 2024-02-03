import { CloneTemplate } from "../../../types/cloneTemplate.js";
import { DatabaseProps } from "../../../interfaces/builder.js";
import { InjectTemplate } from "../../../types/injectTemplate.js";

const createDatabaseCloning = (
    entitiesDest: string,
    enumsDest: string
): CloneTemplate[] => [
    {
        signature: "entities/entities.ts",
        target: "base/typescript/db/entities-file.txt",
        destination: entitiesDest,
        newFileName: "entities.ts",
    },
    {
        signature: "tables-data.enum.ts",
        target: "base/typescript/enum/tables-data.txt",
        destination: enumsDest,
        newFileName: "tables-data.enum.ts",
    },
];

const createDatabaseInjection = ({
    appModuleDest,
    envLocation,
}: DatabaseProps): InjectTemplate[] => [
    {
        signature: "app.module.ts",
        injectable: appModuleDest,
        additions: [
            {
                addition: {
                    base: "components/typescript/db/config.txt",
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: "// --- database ---",
                    },
                },
                keyword: "// ===== configs =====",
            },
            {
                addition: {
                    base: "components/typescript/db/imports.txt",
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: "@nestjs/typeorm",
                    },
                },
                keyword: "*",
            },
        ],
    },
    {
        signature: ".env",
        injectable: envLocation,
        additions: [
            {
                addition: {
                    base: "components/others/db-env.txt",
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: "DB_HOST",
                    },
                },
                keyword: "*",
            },
        ],
    },
];

export { createDatabaseInjection, createDatabaseCloning };
