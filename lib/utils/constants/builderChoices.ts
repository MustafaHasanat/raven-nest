import { ColumnDecoratorChoice } from "../../enums/createAction.js";

export const columnTypeChoices = [
    {
        name: "string",
        value: "string",
        description: "create a simple string column",
    },
    {
        name: "number",
        value: "number",
        description: "create a numeric column (int, float)",
    },
    {
        name: "boolean",
        value: "boolean",
        description: "create a simple boolean column (true/false)",
    },
    {
        name: "date",
        value: "date",
        description: "create a date column",
    },
    {
        name: "time",
        value: "time",
        description: "create a time column",
    },
    {
        name: "enum",
        value: "enum",
        description: "create an enum colum (specified string values)",
    },
    {
        name: "json",
        value: "json",
        description: "create an object-shape column",
    },
    {
        name: "array",
        value: "array",
        description: "create an array-shape column",
    },
    {
        name: "image",
        value: "image",
        description: "uploading an image",
    },
];

export const columnPropertiesChoices = [
    {
        name: "isUnique",
        value: "isUnique",
        description: "a unique column will never accept duplicate rows",
    },
    {
        name: "isRequired",
        value: "isRequired",
        description: "required column can't be ignored or left empty",
    },
    {
        name: "enum",
        value: "enum",
        description: "a column that allows only specified values",
    },
];

export const columnDecoratorsChoices: {
    name: string;
    value: ColumnDecoratorChoice;
    description: string;
}[] = [
    {
        name: "isUUID",
        value: ColumnDecoratorChoice.IS_UUID,
        description: "the string must follow the UUID format",
    },
    {
        name: "length",
        value: ColumnDecoratorChoice.LENGTH,
        description: "the string's length must be within the specified range",
    },
    {
        name: "isEmail",
        value: ColumnDecoratorChoice.IS_EMAIL,
        description: "the string must follow the email format: xx@yy.zz",
    },
    {
        name: "isStrongPassword",
        value: ColumnDecoratorChoice.IS_STRONG_PASS,
        description:
            "the string must have uppercase, lowercase, number, special character, and be longer than 8",
    },
    {
        name: "isPhoneNumber",
        value: ColumnDecoratorChoice.IS_PHONE_NUMBER,
        description:
            "the string must follow the phone number format: +(country-code)(number)",
    },
    {
        name: "isDecimal",
        value: ColumnDecoratorChoice.IS_DECIMAL,
        description: "the number must have a decimal point",
    },
    {
        name: "isInt",
        value: ColumnDecoratorChoice.IS_INT,
        description: "the number must be an integer",
    },
    {
        name: "isDate",
        value: ColumnDecoratorChoice.IS_DATE,
        description: "the input must be of date type (format: M/D/Y)",
    },
];

export const relationChoices = [
    {
        name: "OneToOne",
        value: "OneToOne",
        description:
            "'one-to-one' relation: each record of this table may have a link to only one record from the foreign one",
    },
    {
        name: "OneToMany",
        value: "OneToMany",
        description:
            "'one-to-many' relation: each record of this table may have multiple linked records from the foreign one",
    },
    {
        name: "ManyToMany",
        value: "ManyToMany",
        description:
            "'many-to-many' relation:  multiple records of this table may have a link to only one record from the foreign one",
    },
];
