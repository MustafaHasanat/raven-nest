const propertiesEntityMapObject: {
    [property: string]: string;
} = {
    isUnique: "unique: true",
    isRequired: "nullable: false",
    enum: "type: 'enum',\nenum: ENUM_OBJECT",
};

const propertiesDtoMapObject: {
    [property: string]: string | null;
} = {
    isUnique: null,
    isRequired: "required: true",
    enum: "enum: ENUM_OBJECT",
};

const decoratorsMapObject: {
    [decorator: string]: {
        name: string;
        usage: string;
    };
} = {
    isUUID: { name: "IsUUID", usage: "@IsUUID()" },
    length: { name: "Length", usage: "@Length(MIN_LENGTH, MAX_LENGTH)" },
    isEmail: { name: "IsEmail", usage: "@IsEmail()" },
    isStrongPassword: {
        name: "IsStrongPassword",
        usage: "@IsStrongPassword()",
    },
    isPhoneNumber: { name: "IsPhoneNumber", usage: "@IsPhoneNumber()" },
    isDecimal: { name: "IsDecimal", usage: "@IsDecimal()" },
    isInt: { name: "IsInt", usage: "@IsInt()" },
    isDate: { name: "IsDate", usage: "@IsDate()" },
};

const columnTypeDefaultMap = (
    isRequired: boolean,
    description: string
): {
    [type: string]: {
        dtoCreate: string | null;
        dtoUpdate: string | null;
        entityType: string;
        dtoType: string;
    };
} => {
    const dtoCreateExtra = `description: '${description}',\n${isRequired ? "" : "required: false,\n"}`;
    const dtoUpdateExtra = `description: '${description}',\n`;
    return {
        string: {
            dtoCreate:
                dtoCreateExtra +
                "default: 'placeholder',\nexample: 'placeholder'",
            dtoUpdate: dtoUpdateExtra + "required: false,\nexample: ''",
            entityType: "string",
            dtoType: "string",
        },
        boolean: {
            dtoCreate: dtoCreateExtra + "default: false,\nexample: false",
            dtoUpdate: dtoUpdateExtra + "required: false,\nexample: false",
            entityType: "boolean",
            dtoType: "boolean",
        },
        number: {
            dtoCreate: dtoCreateExtra + "default: 0,\nexample: 0",
            dtoUpdate: dtoUpdateExtra + "required: false,\nexample: 0",
            entityType: "number",
            dtoType: "number",
        },
        date: {
            dtoCreate:
                dtoCreateExtra +
                "default: new Date().toLocaleDateString(),\nexample: new Date().toLocaleDateString()",
            dtoUpdate:
                dtoUpdateExtra +
                "required: false,\nexample: new Date().toLocaleDateString()",
            entityType: "Date",
            dtoType: "Date",
        },
        time: {
            dtoCreate:
                dtoCreateExtra + "default: new Date(),\nexample: new Date()",
            dtoUpdate: dtoUpdateExtra + "required: false,\nexample: new Date()",
            entityType: "Date",
            dtoType: "Date",
        },
        array: {
            dtoCreate:
                dtoCreateExtra + "default: new Date(),\nexample: new Date()",
            dtoUpdate: dtoUpdateExtra + "required: false,\nexample: new Date()",
            entityType: "[]",
            dtoType: "[]",
        },
    };
};

export {
    propertiesEntityMapObject,
    propertiesDtoMapObject,
    decoratorsMapObject,
    columnTypeDefaultMap,
};
