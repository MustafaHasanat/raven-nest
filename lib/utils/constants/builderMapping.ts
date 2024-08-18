/**
 * This will map the properties selections (keys) from the prompt with the corresponding pairs (ke: value)
 * inside the @Column({}) scope in the entity file
 */
export const propertiesEntityMapObject: {
    [property: string]: string;
} = {
    isUnique: "unique: true",
    isRequired: "nullable: false",
};

/**
 * This will map the properties selections (keys) from the prompt with the corresponding pairs (ke: value)
 * inside the @ApiProperty({}) scope in the create-DTO file
 */
export const propertiesDtoMapObject: {
    [property: string]: string | null;
} = {
    isUnique: null,
    isRequired: "required: true",
};

/**
 * This will map the validation selections (keys) from the prompt with the corresponding
 * validators to be placed as decorators for both @ApiProperty() in the create-DTO file,
 * and @Column() in the entity file. The (name) will be placed in the (import) statement,
 * where the (usage) will be the actual decorator
 */
export const decoratorsMapObject: {
    [decorator: string]: {
        name: string;
        usage: string;
    };
} = {
    isUUID: { name: "IsUUID", usage: "@cv.IsUUID()" },
    length: { name: "Length", usage: "@cv.Length(MIN_LENGTH, MAX_LENGTH)" },
    isEmail: { name: "IsEmail", usage: "@cv.IsEmail()" },
    isStrongPassword: {
        name: "IsStrongPassword",
        usage: "@cv.IsStrongPassword()",
    },
    isPhoneNumber: { name: "IsPhoneNumber", usage: "@cv.IsPhoneNumber()" },
    isDecimal: { name: "IsDecimal", usage: "@cv.IsDecimal()" },
    isInt: { name: "IsInt", usage: "@cv.IsInt()" },
    isDate: { name: "IsDate", usage: "@cv.IsDate()" },
    isEnum: { name: "IsEnum", usage: "@cv.IsEnum(ENUM_OBJECT)" },
};

/**
 * This will populate the selected column type to be used as:
 * - (dtoCreate): The corresponding fields used in the create DTO file inside @ApiProperty({}) scope
 * - (dtoUpdate): The corresponding fields used in the update DTO file inside @ApiProperty({}) scope
 * - (entityType):  The type used in the entity file for the column (columnName: type)
 * - (dtoType): The type used in the DTO file for the column (columnName: type)
 *
 * @param isRequired is the column required
 * @param description the description of the column
 * @returns a mapping object to filter the selected type
 */
export const columnTypeDefaultMap = (
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
        enum: {
            dtoCreate:
                dtoCreateExtra +
                "default: ENUM_OBJECT.SELECT_OPTION,\nexample: ENUM_OBJECT.SELECT_OPTION",
            dtoUpdate:
                dtoUpdateExtra +
                "required: false,\nexample: ENUM_OBJECT.SELECT_OPTION",
            entityType: "ENUM_OBJECT",
            dtoType: "ENUM_OBJECT",
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
