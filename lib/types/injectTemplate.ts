type InjectionAdditionAction = {
    keyword: string;
    addition: {
        base: string;
        additionIsFile?: boolean;
        conditional?: {
            type: "SUPPOSED_TO_BE_THERE" | "NONE";
            data: string | null;
        };
    };
    replacements?: {
        oldString: string;
        newString: string;
    }[];
    replica?: boolean;
} | null;

type InjectionDeletionAction = {
    keyword: string;
    deletion?: {
        isWholeLine?: boolean;
        conditional?: {
            type:
                | "WHOLE_LINE"
                | "REPLACED_WITH"
                | "REPLACED_OR_ADD_WITH"
                | "NONE";
            data: string | null;
        };
    };
};

type InjectTemplate = {
    signature: string;
    injectable: string;
    additions?: InjectionAdditionAction[];
    deletions?: InjectionDeletionAction[];
};

export { InjectTemplate, InjectionAdditionAction, InjectionDeletionAction };
