import { CloneTemplate, InjectTemplate } from "engine";
import { CreateDatabaseProps } from "../../interfaces/builder.js";

const createDatabaseCloning = ({
    paths: { user, permission, role },
}: CreateDatabaseProps): CloneTemplate[] => [
    {
        signature: "entities/entities.ts",
        target: "base/typescript/db/entities-file.txt",
        destination: user.entitiesPath,
        newFileName: "entities.ts",
    },
    {
        signature: "entities/index.ts",
        target: "base/typescript/db/index.txt",
        destination: user.entitiesPath,
        newFileName: "index.ts",
    },
    // role files
    {
        signature: "role.entity.ts",
        target: `base/typescript/table/role/entity.txt`,
        destination: role.entitiesPath,
        newFileName: "role.entity.ts",
    },
    {
        signature: "create-role-dto.ts",
        target: `base/typescript/table/role/createDto.txt`,
        destination: role.dtoPath,
        newFileName: `create-role.dto.ts`,
    },
    {
        signature: "update-role-dto.ts",
        target: `base/typescript/table/role/updateDto.txt`,
        destination: role.dtoPath,
        newFileName: `update-role.dto.ts`,
    },
    {
        signature: "role.module.ts",
        target: `base/typescript/table/role/module.txt`,
        destination: role.schemasPath,
        newFileName: `roles.module.ts`,
    },
    {
        signature: "role.controller.ts",
        target: `base/typescript/table/role/controller.txt`,
        destination: role.schemasPath,
        newFileName: `roles.controller.ts`,
    },
    {
        signature: "role.service.ts",
        target: `base/typescript/table/role/service.txt`,
        destination: role.schemasPath,
        newFileName: `roles.service.ts`,
    },
    // permission files
    {
        signature: "permission.entity.ts",
        target: `base/typescript/table/permission/entity.txt`,
        destination: permission.entitiesPath,
        newFileName: "permission.entity.ts",
    },
    {
        signature: "create-permission-dto.ts",
        target: `base/typescript/table/permission/createDto.txt`,
        destination: permission.dtoPath,
        newFileName: `create-permission.dto.ts`,
    },
    {
        signature: "update-permission-dto.ts",
        target: `base/typescript/table/permission/updateDto.txt`,
        destination: permission.dtoPath,
        newFileName: `update-permission.dto.ts`,
    },
    {
        signature: "permission.module.ts",
        target: `base/typescript/table/permission/module.txt`,
        destination: permission.schemasPath,
        newFileName: `permissions.module.ts`,
    },
    {
        signature: "permission.controller.ts",
        target: `base/typescript/table/permission/controller.txt`,
        destination: permission.schemasPath,
        newFileName: `permissions.controller.ts`,
    },
    {
        signature: "permission.service.ts",
        target: `base/typescript/table/permission/service.txt`,
        destination: permission.schemasPath,
        newFileName: `permissions.service.ts`,
    },
    // user files
    {
        signature: "user.entity.ts",
        target: `base/typescript/table/user/entity.txt`,
        destination: user.entitiesPath,
        newFileName: "user.entity.ts",
    },
    {
        signature: "create-user-dto.ts",
        target: `base/typescript/table/user/createDto.txt`,
        destination: user.dtoPath,
        newFileName: `create-user.dto.ts`,
    },
    {
        signature: "update-user-dto.ts",
        target: `base/typescript/table/user/updateDto.txt`,
        destination: user.dtoPath,
        newFileName: `update-user.dto.ts`,
    },
    {
        signature: "user.module.ts",
        target: `base/typescript/table/user/module.txt`,
        destination: user.schemasPath,
        newFileName: `users.module.ts`,
    },
    {
        signature: "user.controller.ts",
        target: `base/typescript/table/user/controller.txt`,
        destination: user.schemasPath,
        newFileName: `users.controller.ts`,
    },
    {
        signature: "user.service.ts",
        target: `base/typescript/table/user/service.txt`,
        destination: user.schemasPath,
        newFileName: `users.service.ts`,
    },
    {
        signature: "login-user.dto.ts",
        target: "base/typescript/table/user/loginDto.txt",
        destination: user.dtoPath,
        newFileName: "login-user.dto.ts",
    },
    {
        signature: "users.enum.ts",
        target: "base/typescript/table/user/enums.txt",
        destination: user.enumsPath,
        newFileName: "users.enum.ts",
    },
    {
        signature: "token-payload.type.ts",
        target: "base/typescript/table/user/token-payload.txt",
        destination: user.typesPath,
        newFileName: "token-payload.type.ts",
    },
];

const createDatabaseInjection = ({
    appModuleDest,
    envLocation,
    db: { host, name, password, port, username },
}: CreateDatabaseProps): InjectTemplate[] => [
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
                keyword: "*",
                addition: {
                    base: "components/others/db-env.txt",
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: "DATABASE_HOST",
                    },
                },
                replacements: [
                    {
                        oldString: "DB_HOST",
                        newString: host,
                    },
                    {
                        oldString: "DB_NAME",
                        newString: name,
                    },
                    {
                        oldString: "DB_USERNAME",
                        newString: username,
                    },
                    {
                        oldString: "DB_PASSWORD",
                        newString: password,
                    },
                    {
                        oldString: "DB_PORT",
                        newString: port,
                    },
                ],
            },
        ],
    },
];

export { createDatabaseInjection, createDatabaseCloning };
