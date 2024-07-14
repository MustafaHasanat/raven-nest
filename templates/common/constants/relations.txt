type RelationsListing = {
    oneToOne: string[];
    oneToMany: string[];
    manyToOne: string[];
    manyToMany: string[];
};

type Tables<T> = {
    role: T;
    permission: T;
    user: T;
    product: T;
    category: T;
    profile: T;
};

const RELATIONS: Tables<RelationsListing> = {
    role: {
        oneToOne: [],
        oneToMany: ["permissions"],
        manyToOne: [],
        manyToMany: [],
    },
    permission: {
        oneToOne: [],
        oneToMany: [],
        manyToOne: ["role"],
        manyToMany: [],
    },
    user: {
        oneToOne: ["profile"],
        oneToMany: ["products"],
        manyToOne: [],
        manyToMany: [],
    },
    product: {
        oneToOne: [],
        oneToMany: [],
        manyToOne: ["user"],
        manyToMany: ["categories"],
    },
    category: {
        oneToOne: [],
        oneToMany: [],
        manyToOne: [],
        manyToMany: ["products"],
    },
    profile: {
        oneToOne: ["user"],
        oneToMany: [],
        manyToOne: [],
        manyToMany: [],
    },
};

export const RELATIONS_OBJECT: Tables<{
    ascendants: string[];
    descendants: string[];
}> = {
    role: {
        descendants: [
            ...RELATIONS.role.oneToMany,
            ...RELATIONS.role.manyToOne,
            ...RELATIONS.role.manyToMany,
        ],
        ascendants: [...RELATIONS.role.manyToOne, ...RELATIONS.role.manyToMany],
    },
    permission: {
        descendants: [
            ...RELATIONS.permission.oneToMany,
            ...RELATIONS.permission.manyToOne,
            ...RELATIONS.permission.manyToMany,
        ],
        ascendants: [
            ...RELATIONS.permission.manyToOne,
            ...RELATIONS.permission.manyToMany,
        ],
    },
    user: {
        descendants: [
            ...RELATIONS.user.oneToMany,
            ...RELATIONS.user.manyToOne,
            ...RELATIONS.user.manyToMany,
        ],
        ascendants: [...RELATIONS.user.manyToOne, ...RELATIONS.user.manyToMany],
    },
    product: {
        descendants: [
            ...RELATIONS.product.oneToMany,
            ...RELATIONS.product.manyToOne,
            ...RELATIONS.product.manyToMany,
        ],
        ascendants: [
            ...RELATIONS.product.manyToOne,
            ...RELATIONS.product.manyToMany,
        ],
    },
    category: {
        descendants: [
            ...RELATIONS.category.oneToMany,
            ...RELATIONS.category.manyToOne,
            ...RELATIONS.category.manyToMany,
        ],
        ascendants: [
            ...RELATIONS.category.manyToOne,
            ...RELATIONS.category.manyToMany,
        ],
    },
    profile: {
        descendants: [
            ...RELATIONS.profile.oneToMany,
            ...RELATIONS.profile.manyToOne,
            ...RELATIONS.profile.manyToMany,
        ],
        ascendants: [
            ...RELATIONS.profile.manyToOne,
            ...RELATIONS.profile.manyToMany,
        ],
    },
};
