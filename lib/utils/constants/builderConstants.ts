import {
    columnDecoratorsChoices,
    columnPropertiesChoices,
    columnTypeChoices,
    relationChoices,
} from "./builderChoices.js";
import { BuilderConstantsProps } from "../../interfaces/constants.js";
import {
    checkboxValidator,
    enumValuesValidator,
    inputValidator,
    stringLengthValidator,
    tableNamesValidator,
} from "../validators/stringValidators.js";
import { dirFilter, inputTrimmer } from "../filters/stringFilters.js";

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
    dockerInit: {
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
        publicDir: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "publicDir",
            default: "public",
            message: "What is the destination to your 'public' folder?",
            when: () => dirFilter("public"),
            transformer: (answer: string) => (answer === "." ? "" : answer),
        },
        rootDir: {
            ...sharedAttrs.input.dest,
            type: "input",
            name: "rootDir",
            default: ".",
            message: "What is the destination of your '.env' file?",
        },
    },
    // constants for the "database" choice
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
        dbHost: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "dbHost",
            message: "What's the name of your database host?",
            default: "localhost",
        },
        dbUsername: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "dbUsername",
            message: "What's the username of your database?",
            default: "postgres",
        },
        dbPassword: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "dbPassword",
            message: "What's the password of your database?",
            default: "postgres",
        },
        dbName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "dbName",
            message: "What's the name of your database?",
            default: "postgres",
        },
        dbPort: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "dbPort",
            message: "What's the port you're using for your database?",
            default: "5432",
        },
    },
    // constants for the "table" choice
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
        description: {
            type: "input",
            name: "description",
            default: "",
            message: "Write down a description for this field: (optional)",
        },
        defaultValue: {
            type: "input",
            name: "defaultValue",
            default: null,
            message: "Write down the default value for this field: (optional)",
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
                "Specify the 'min' and 'max' lengths for your string separated by a comma with no spaces (e.g: '3,25'): ",
            validate: stringLengthValidator,
        },
        enumName: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "enumName",
            message:
                "What is the name of your enum variable, use PascalCase (e.g. 'UserRole')",
        },
        enumValues: {
            ...sharedAttrs.input.name,
            type: "input",
            name: "enumValues",
            message:
                "List the enum values separated by commas with no spaces, only use alphanumerics (e.g: 'status1,status2,status3'): ",
            validate: enumValuesValidator,
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
                "Enter the names of the tables separated by a dash: \n- use singular camelCase nouns to avoid errors, like: user-product \n- the order of the names is important",
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
