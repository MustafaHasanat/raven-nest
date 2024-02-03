import {
    columnDecoratorsChoices,
    columnPropertiesChoices,
    columnTypeChoices,
    relationChoices,
} from "./builderChoices.js";
import { BuilderConstantsProps } from "../../interfaces/constants.js";
import {
    checkboxValidator,
    inputValidator,
    stringLengthValidator,
    tableNamesValidator,
} from "../../utils/validators/stringValidators.js";
import { dirFilter, inputTrimmer } from "../../utils/filters/stringFilters.js";

const sharedAttrs = {
    input: {
        name: {
            default: "",
            validate: (input: string) => inputValidator({ input }),
            filter: inputTrimmer,
        },
        dest: {
            validate: (input: string) =>
                inputValidator({ input, isDestination: true }),
            filter: inputTrimmer,
            when: (input: string) => dirFilter(input),
        },
    },
    checkbox: {
        multiple: {
            validate: (options: string[]) => checkboxValidator({ options }),
        },
        onlyOne: {
            validate: (options: string[]) =>
                checkboxValidator({ options, isOne: true }),
        },
    },
};

const builderConstants: BuilderConstantsProps = {
    // constants for the "main" choice
    createMain: {
        projectName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "projectName",
            message: "What's the name of your project?",
            validate: (input: string) =>
                inputValidator({ input, allowSpaces: true }),
        },
        mainDest: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "mainDest",
            default: "src",
            message: "What is the destination of your 'main.ts' file?",
        },
    },
    // constants for the "main" choice
    createLandingPage: {
        projectName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "projectName",
            message: "What's the name of your project?",
            validate: (input: string) =>
                inputValidator({ input, allowSpaces: true }),
        },
        publicDir: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "publicDir",
            default: "public",
            message: "What is the destination to your 'public' folder?",
            when: () => dirFilter("public"),
            transformer: (answer: string) => (answer === "." ? "" : answer),
        },
    },
    // constants for the "landing-page" choice
    createAppFiles: {
        mainDest: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "mainDest",
            default: "src",
            message:
                "What is the destination of your app files (module, controller, service)?",
        },
        projectName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "projectName",
            message: "What's the name of your project?",
            validate: (input: string) =>
                inputValidator({ input, allowSpaces: true }),
        },
        rootDir: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "rootDir",
            default: ".",
            message: "What is the destination of your '.env' file?",
        },
    },
    // constants for the "app" choice
    createDatabase: {
        rootDir: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "rootDir",
            default: ".",
            message:
                "What is the destination of your project's root directory?",
        },
        mainDest: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "mainDest",
            default: "src",
            message:
                "What is the destination of your app files (module, controller, service)?",
        },
    },
    // constants for the "database" choice
    createTable: {
        tableName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "tableName",
            message:
                "What's the name of your table? (use singular camelCase nouns to avoid errors, like: user, product, ...)",
        },
        mainDest: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "mainDest",
            default: "src",
            message:
                "Where have you located your schemas, entities, dtos, ... ?",
        },
        isSpecial: (tableName) => ({
            type: "confirm",
            name: "isSpecial",
            message: `You're trying to create a special type of tables: "${tableName}". Do you want us to build the standard form of this table?`,
        }),
    },
    // constants for the "column" choice
    createColumn: {
        newColumn: {
            type: "confirm",
            name: "newColumn",
            message: "Do you want to create a new column?",
            default: true,
        },
        mainDest: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "mainDest",
            default: "src",
            message:
                "Where have you located your schemas, entities, dtos, ... ?",
        },
        tableName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "tableName",
            message:
                "What's the name of your table? (use singular camelCase nouns to avoid errors, like: user, product, ...)",
        },
        columnName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "columnName",
            message:
                "What's the name of your new column? (use camelCase nouns to avoid errors, like: userAge, cartItems, ...)",
        },
        columnType: {
            ...sharedAttrs.checkbox.onlyOne,
            type: "checkbox",
            name: "columnType",
            message:
                "Select the type of the new column: (exactly one must be selected)",
            choices: columnTypeChoices,
        },
        columnProperties: {
            ...sharedAttrs.checkbox.multiple,
            type: "checkbox",
            name: "columnProperties",
            message: "Select the properties of this column: (optional)",
            choices: columnPropertiesChoices,
        },
        columnDecorators: {
            ...sharedAttrs.checkbox.multiple,
            type: "checkbox",
            name: "columnDecorators",
            message:
                "Select the validators that should be applied to this column: (optional)",
            choices: columnDecoratorsChoices,
        },
        stringLength: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "stringLength",
            message:
                "Specify the 'min' and 'max' lengths for your string separated by a comma with no spaces (e.g: 3,25): ",
            validate: stringLengthValidator,
        },
    },
    // constants for the "relation" choice
    createRelation: {
        newRelation: {
            type: "confirm",
            name: "newRelation",
            message: "Do you want to create a new relation?",
            default: true,
        },
        relationType: {
            ...sharedAttrs.checkbox.onlyOne,
            type: "checkbox",
            name: "relationType",
            message:
                "Select the type of the new relation: (exactly one must be selected)",
            choices: relationChoices,
        },
        fieldName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "fieldName",
            message:
                "Enter the name of one of your 2nd table's fields: (camelCased)",
        },
        mainDest: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "mainDest",
            default: "src",
            message:
                "Where have you located your schemas, entities, dtos, ... ?",
        },
        tables: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "tables",
            message:
                "Enter the names of the tables separated by a dash \n(use singular camelCase nouns to avoid errors, like: user-product)",
            validate: tableNamesValidator,
        },
    },
    // shared constants
    shared: {
        overwrite: (files: string[]) => ({
            ...sharedAttrs.checkbox.multiple,
            name: "overwrite",
            type: "checkbox",
            message:
                "Select the files you want us to override (selecting all is recommended)",
            choices: files.map((fileName) => ({
                name: fileName,
                value: fileName,
                description: fileName,
            })),
            default: files,
        }),
    },
};

export default builderConstants;
