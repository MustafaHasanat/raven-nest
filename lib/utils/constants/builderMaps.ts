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
};

const columnTypeDefaultMap: {
    [type: string]: {
        dtoCreate: string | null;
        dtoUpdate: string | null;
        entityType: string;
        dtoType: string;
    };
} = {
    string: {
        dtoCreate: "default: 'placeholder',\nexample: 'placeholder'",
        dtoUpdate: "required: false,\nexample: 'placeholder'",
        entityType: "string",
        dtoType: "string",
    },
    boolean: {
        dtoCreate: "default: false,\nexample: false",
        dtoUpdate: "required: false,\nexample: false",
        entityType: "boolean",
        dtoType: "boolean",
    },
    number: {
        dtoCreate: "default: 0,\nexample: 0",
        dtoUpdate: "required: false,\nexample: 0",
        entityType: "number",
        dtoType: "number",
    },
    date: {
        dtoCreate: "default: new Date(),\nexample: new Date()",
        dtoUpdate: "required: false,\nexample: new Date()",
        entityType: "Date",
        dtoType: "Date",
    },
    time: {
        dtoCreate: "default: new Date(),\nexample: new Date()",
        dtoUpdate: "required: false,\nexample: new Date()",
        entityType: "Date",
        dtoType: "Date",
    },
    array: {
        dtoCreate: "default: new Date(),\nexample: new Date()",
        dtoUpdate: "required: false,\nexample: new Date()",
        entityType: "[]",
        dtoType: "[]",
    },
};

export {
    propertiesEntityMapObject,
    propertiesDtoMapObject,
    decoratorsMapObject,
    columnTypeDefaultMap,
};
