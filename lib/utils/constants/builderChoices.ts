const columnTypeChoices = [
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
        name: "object",
        value: "object",
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

const columnPropertiesChoices = [
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

const columnDecoratorsChoices = [
    {
        name: "isUUID",
        value: "isUUID",
        description: "the string must follow the UUID format",
    },
    {
        name: "length",
        value: "length",
        description: "the string's length must be within the specified range",
    },
    {
        name: "isEmail",
        value: "isEmail",
        description: "the string must follow the email format: xx@yy.zz",
    },
    {
        name: "isStrongPassword",
        value: "isStrongPassword",
        description:
            "the string must have uppercase, lowercase, number, special character, and be longer than 8",
    },
    {
        name: "isPhoneNumber",
        value: "isPhoneNumber",
        description:
            "the string must follow the phone number format: +(country-code)(number)",
    },
    {
        name: "isDecimal",
        value: "isDecimal",
        description: "the number must have a decimal point",
    },
    {
        name: "isInt",
        value: "isInt",
        description: "the number must be an integer",
    },
];

const relationChoices = [
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

export {
    columnTypeChoices,
    columnPropertiesChoices,
    relationChoices,
    columnDecoratorsChoices,
};
