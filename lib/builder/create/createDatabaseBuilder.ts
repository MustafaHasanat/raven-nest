import inquirer from "inquirer";
import constants from "../../utils/constants/builderConstants.js";
import { pathConvertor } from "../../utils/helpers/filesHelpers.js";
import {
    createDatabaseCloning,
    createDatabaseInjection,
} from "../../commands/create/createDatabase.js";
import manipulator from "../../engines/manipulator.js";
import { MemoValues, QuestionQuery } from "actions";
import { memosToQuestions } from "../../engines/memorizer.js";
import { ConfigCategory } from "../../enums/actions.js";
import NameVariant from "../../models/nameVariant.js";
import SubPath from "../../models/subPath.js";

/**
 * This function will be fired by the --database option
 */
const createDatabaseBuilder = async (memoValues: MemoValues) => {
    inquirer
        .prompt([
            ...memosToQuestions(memoValues, [
                constants.createDatabase.rootDir,
                constants.createDatabase.mainDest,
                constants.createDatabase.dbHost,
                constants.createDatabase.dbName,
                constants.createDatabase.dbUsername,
                constants.createDatabase.dbPassword,
                constants.createDatabase.dbPort,
            ] as QuestionQuery[]),
            constants.shared.overwrite([
                "app.module.ts",
                "entities/entities.ts",
                "entities/index.ts",
                "tables.enum.ts",
                ".env",
                "role.entity.ts",
                "create-role-dto.ts",
                "update-role-dto.ts",
                "role.module.ts",
                "role.controller.ts",
                "role.service.ts",
                "permission.entity.ts",
                "create-permission-dto.ts",
                "update-permission-dto.ts",
                "permission.module.ts",
                "permission.controller.ts",
                "permission.service.ts",
                "user.entity.ts",
                "create-user-dto.ts",
                "update-user-dto.ts",
                "user.module.ts",
                "user.controller.ts",
                "user.service.ts",
                "login-user.dto.ts",
                "users.enum.ts",
                "token-payload.ts",
            ]),
        ])
        .then(
            async ({
                overwrite,
                rootDir,
                mainDest,
                dbHost,
                dbUsername,
                dbPassword,
                dbName,
                dbPort,
            }) => {
                // get the names variants and the paths
                const userVariantObj = new NameVariant("user");
                const roleVariantObj = new NameVariant("role");
                const permissionVariantObj = new NameVariant("permission");

                const userPathObj = new SubPath({
                    mainDir: mainDest,
                    nameVariant: userVariantObj,
                });
                const rolePathObj = new SubPath({
                    mainDir: mainDest,
                    nameVariant: roleVariantObj,
                });
                const permissionPathObj = new SubPath({
                    mainDir: mainDest,
                    nameVariant: permissionVariantObj,
                });

                const props = {
                    paths: {
                        user: userPathObj,
                        role: rolePathObj,
                        permission: permissionPathObj,
                    },
                    appModuleDest: pathConvertor(mainDest, "app.module.ts"),
                    envLocation: pathConvertor(rootDir, ".env"),
                    db: {
                        host: dbHost,
                        username: dbUsername,
                        password: dbPassword,
                        name: dbName,
                        port: dbPort,
                    },
                };

                await manipulator({
                    actionTag: "create-database",
                    cloningCommands: createDatabaseCloning(props),
                    injectionCommands: createDatabaseInjection(props),
                    memo: {
                        pairs: { rootDir, mainDest },
                        category: ConfigCategory.RAVEN_NEST,
                    },
                    overwrite,
                });
            }
        );
};
export default createDatabaseBuilder;
