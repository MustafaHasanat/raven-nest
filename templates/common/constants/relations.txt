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
        oneToOne: [],
        oneToMany: [],
        manyToOne: [],
        manyToMany: [],
    },
};

export const RELATIONS_OBJECT: Tables<{
    ascendants: string[];
    descendants: string[];
}> = {
    // --- app relations ---
    // --- default relations ---
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
};
