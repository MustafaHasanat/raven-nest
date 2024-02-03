export type QuestionQuery = {
    name: string;
    default?: string;
    type: "input" | "checkbox" | "confirm";
};

export type MemoValues = { [key: string]: string };
