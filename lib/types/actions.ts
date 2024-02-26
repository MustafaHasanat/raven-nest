export type QuestionQuery = {
    name: string;
    default?: string;
    type: "input" | "checkbox" | "confirm";
};

export type MemoValues = { [key: string]: string };

export type ActionTag =
    | "init-install"
    | "init-docker"
    | "create-main"
    | "create-landing-page"
    | "create-app"
    | "create-database"
    | "create-table"
    | "create-column"
    | "create-relation";
