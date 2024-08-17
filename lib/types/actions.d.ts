declare module "actions" {
    type QuestionQuery = {
        name: string;
        default?: string;
        type: "input" | "checkbox" | "confirm";
    };

    type MemoValues = { [key: string]: string };

    type ActionTag =
        | "init-install"
        | "init-docker"
        | "create-main"
        | "create-database"
        | "create-table"
        | "create-column"
        | "create-relation";
}
