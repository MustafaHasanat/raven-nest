export enum SpecialTableType {
    PRODUCT = "product",
    NOTIFICATION = "notification",
}

export enum ColumnTypeChoice {
    STRING = "string",
    BOOLEAN = "boolean",
    NUMBER = "number",
    ENUM = "enum",
    DATE = "date",
    TIME = "time",
    OBJECT = "object",
    ARRAY = "array",
    IMAGE = "image",
}

export enum ColumnPropertyChoice {
    IS_UNIQUE = "isUnique",
    IS_REQUIRED = "isRequired",
    ENUM = "enum",
}

export enum ColumnDecoratorChoice {
    IS_UUID = "isUUID",
    LENGTH = "length",
    IS_EMAIL = "isEmail",
    IS_STRONG_PASS = "isStrongPassword",
    IS_PHONE_NUMBER = "isPhoneNumber",
    IS_DECIMAL = "isDecimal",
    IS_INT = "isInt",
    IS_DATE = "isDate",
}
