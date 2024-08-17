import { CloneTemplate, InjectTemplate } from "engine";

export const initCloning = (): CloneTemplate[] => [
    {
        signature: "memo.json",
        target: "base/others/memo-json.txt",
        destination: ".",
        newFileName: "memo.json",
    },
    // Constants
    {
        signature: "",
        target: "common/constants/services.txt",
        destination: "src/common/constants",
        newFileName: "services.ts",
    },
    {
        signature: "",
        target: "common/constants/relations.txt",
        destination: "src/common/constants",
        newFileName: "relations.ts",
    },
    // Decorators
    {
        signature: "",
        target: "common/decorators/controller-wrapper.txt",
        destination: "src/common/decorators",
        newFileName: "controller.decorator.ts",
    },
    {
        signature: "",
        target: "common/decorators/delete-wrapper.txt",
        destination: "src/common/decorators",
        newFileName: "delete.decorator.ts",
    },
    {
        signature: "",
        target: "common/decorators/editors-wrapper.txt",
        destination: "src/common/decorators",
        newFileName: "editors.decorator.ts",
    },
    {
        signature: "",
        target: "common/decorators/getBy-wrappers.txt",
        destination: "src/common/decorators",
        newFileName: "getBy.decorator.ts",
    },
    {
        signature: "",
        target: "common/decorators/index.txt",
        destination: "src/common/decorators",
        newFileName: "index.ts",
    },
    // Enums
    {
        signature: "",
        target: "common/enums/filters.txt",
        destination: "src/common/enums",
        newFileName: "filters.ts",
    },
    {
        signature: "",
        target: "common/enums/permissions.txt",
        destination: "src/common/enums",
        newFileName: "permissions.enum.ts",
    },
    {
        signature: "",
        target: "common/enums/tables.txt",
        destination: "src/common/enums",
        newFileName: "tables.enum.ts",
    },
    {
        signature: "",
        target: "common/enums/users.txt",
        destination: "src/common/enums",
        newFileName: "users.enum.ts",
    },
    // Guards
    {
        signature: "",
        target: "common/guards/auth.txt",
        destination: "src/common/guards",
        newFileName: "auth.guard.ts",
    },
    {
        signature: "",
        target: "common/guards/permission.txt",
        destination: "src/common/guards",
        newFileName: "permission.guard.ts",
    },
    {
        signature: "",
        target: "common/guards/index.txt",
        destination: "src/common/guards",
        newFileName: "index.ts",
    },
    // Helpers
    {
        signature: "",
        target: "common/helpers/services.txt",
        destination: "src/common/helpers",
        newFileName: "services.ts",
    },
    {
        signature: "",
        target: "common/helpers/crud.txt",
        destination: "src/common/helpers",
        newFileName: "crud.ts",
    },
    {
        signature: "",
        target: "common/helpers/stringHelpers.txt",
        destination: "src/common/helpers",
        newFileName: "stringHelpers.ts",
    },
    {
        signature: "",
        target: "common/helpers/index.txt",
        destination: "src/common/helpers",
        newFileName: "index.ts",
    },
    // Middlewares
    {
        signature: "",
        target: "common/middlewares/filters.txt",
        destination: "src/common/middlewares",
        newFileName: "filters.middleware.ts",
    },
    {
        signature: "",
        target: "common/middlewares/validators.txt",
        destination: "src/common/middlewares",
        newFileName: "validators.middleware.ts",
    },
    {
        signature: "",
        target: "common/middlewares/index.txt",
        destination: "src/common/middlewares",
        newFileName: "index.ts",
    },
    // Pipes
    {
        signature: "",
        target: "common/pipes/delete.txt",
        destination: "src/common/pipes",
        newFileName: "delete.pipe.ts",
    },
    {
        signature: "",
        target: "common/pipes/get.txt",
        destination: "src/common/pipes",
        newFileName: "get.pipe.ts",
    },
    {
        signature: "",
        target: "common/pipes/post_patch.txt",
        destination: "src/common/pipes",
        newFileName: "post_patch.pipe.ts",
    },
    {
        signature: "",
        target: "common/pipes/index.txt",
        destination: "src/common/pipes",
        newFileName: "index.ts",
    },
    // Responses
    {
        signature: "",
        target: "common/responses/restResponse.txt",
        destination: "src/common/responses",
        newFileName: "restResponse.ts",
    },
    {
        signature: "",
        target: "common/responses/validationResponse.txt",
        destination: "src/common/responses",
        newFileName: "validationResponse.ts",
    },
    {
        signature: "",
        target: "common/responses/index.txt",
        destination: "src/common/responses",
        newFileName: "index.ts",
    },
    // Types
    {
        signature: "",
        target: "common/types/app.txt",
        destination: "src/common/types",
        newFileName: "app.ts",
    },
    {
        signature: "",
        target: "common/types/customResponseType.txt",
        destination: "src/common/types",
        newFileName: "customResponseType.ts",
    },
    {
        signature: "",
        target: "common/types/getOperators.txt",
        destination: "src/common/types",
        newFileName: "getOperators.ts",
    },
    {
        signature: "",
        target: "common/types/token-payload.txt",
        destination: "src/common/types",
        newFileName: "token-payload.ts",
    },
    {
        signature: "",
        target: "common/types/index.txt",
        destination: "src/common/types",
        newFileName: "index.ts",
    },
];

export const initInjection = (): InjectTemplate[] => [
    {
        signature: ".gitignore",
        injectable: ".gitignore",
        additions: [
            {
                keyword: "*",
                addition: {
                    base: "memo.json\n.env\n\n",
                    additionIsFile: false,
                    conditional: {
                        type: "SUPPOSED_TO_BE_THERE",
                        data: "memo"
                    },
                },
            },
        ],
    },
];
