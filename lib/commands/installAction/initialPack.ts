import { CloneTemplate } from "../../types/cloneTemplate.js";
import { InjectTemplate } from "../../types/injectTemplate.js";

const installInitCloning = (): CloneTemplate[] => [
    {
        signature: "memo.json",
        target: "base/others/memo-json.txt",
        destination: ".",
        newFileName: "memo.json",
    },
    {
        signature: "",
        target: "external/constants/services.txt",
        destination: "src/eaglenest/constants",
        newFileName: "services.ts",
    },
    {
        signature: "",
        target: "external/decorators/admins.txt",
        destination: "src/eaglenest/decorators",
        newFileName: "admins.ts",
    },
    {
        signature: "",
        target: "external/decorators/controller-wrapper.txt",
        destination: "src/eaglenest/decorators",
        newFileName: "controller-wrapper.ts",
    },
    {
        signature: "",
        target: "external/decorators/editors-wrapper.txt",
        destination: "src/eaglenest/decorators",
        newFileName: "editors-wrapper.ts",
    },
    {
        signature: "",
        target: "external/decorators/get-all-wrapper.txt",
        destination: "src/eaglenest/decorators",
        newFileName: "get-all-wrapper.ts",
    },
    {
        signature: "",
        target: "external/decorators/members.txt",
        destination: "src/eaglenest/decorators",
        newFileName: "members.ts",
    },
    {
        signature: "",
        target: "external/enums/filters.txt",
        destination: "src/eaglenest/enums",
        newFileName: "filters.ts",
    },
    {
        signature: "",
        target: "external/helpers/filters.txt",
        destination: "src/eaglenest/helpers",
        newFileName: "filters.ts",
    },
    {
        signature: "",
        target: "external/helpers/services.txt",
        destination: "src/eaglenest/helpers",
        newFileName: "services.ts",
    },
    {
        signature: "",
        target: "external/helpers/validators.txt",
        destination: "src/eaglenest/helpers",
        newFileName: "validators.ts",
    },
    {
        signature: "",
        target: "external/responses/restResponse.txt",
        destination: "src/eaglenest/responses",
        newFileName: "restResponse.ts",
    },
    {
        signature: "",
        target: "external/responses/validationResponse.txt",
        destination: "src/eaglenest/responses",
        newFileName: "validationResponse.ts",
    },
    {
        signature: "",
        target: "external/types/customResponseType.txt",
        destination: "src/eaglenest/types",
        newFileName: "customResponseType.ts",
    },
    {
        signature: "",
        target: "external/types/getOperators.txt",
        destination: "src/eaglenest/types",
        newFileName: "getOperators.ts",
    },
    {
        signature: "",
        target: "external/index-fle.txt",
        destination: "src/eaglenest",
        newFileName: "index.ts",
    }
];

const installInitInjection = (): InjectTemplate[] => [
    {
        signature: ".gitignore",
        injectable: ".gitignore",
        additions: [
            {
                keyword: "*",
                addition: {
                    base: "memo.json\n\n",
                    additionIsFile: false,
                },
            },
        ],
    },
];

export { installInitCloning, installInitInjection };
