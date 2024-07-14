export enum RoleFields {
    ID = "id",
    NAME = "name",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
}

export enum PermissionFields {
    ID = "id",
    DESCRIPTION = "description",
    ACTION = "action",
    TABLE = "table",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
}

export enum UserFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    USERNAME = "username",
    EMAIL = "email",
    PHONE_NUMBER = "phoneNumber",
    ROLE = "role",
}

export enum ProductFields {
    ID = "id",
    NAME = "name",
    PRICE = "price",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
}

export enum CategoryFields {
    ID = "id",
    NAME = "name",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
}

export enum ProfileFields {
    ID = "id",
    AGE = "age",
    BIRTHDAY = "birthday",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
}

export enum TablesNames {
    USERS = "users",
    PRODUCTS = "products",
    CATEGORIES = "categories",
    PROFILES = "profiles",
    ROLES = "roles",
    PERMISSIONS = "permissions",
}

export type AllTablesColumns = RoleFields | UserFields | ProductFields;
