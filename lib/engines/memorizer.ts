/* eslint-disable @typescript-eslint/no-unused-vars */
import { specialLog } from "../utils/helpers/logHelpers.js";
import { MemoCategory } from "../enums/actions.js";
import { readFile, writeFile } from "fs/promises";
import { ActionTag, MemoValues, QuestionQuery } from "actions";
import { QuestionCollection } from "inquirer";
import { join } from "path";

interface CheckMemoProps {
    keys: string[];
    category: MemoCategory;
}

export interface MemorizerProps {
    pairs: {
        [key: string]: any;
    };
    category: MemoCategory;
}

// -------------------------------------

export const readMemoFile = async (category: MemoCategory): Promise<any> => {
    try {
        const memoFileContent: { [key: string]: any } = JSON.parse(
            await readFile("memo.json", "utf8")
        );

        !!!memoFileContent[category] && (memoFileContent[category] = {});

        return memoFileContent;
    } catch (error) {
        throw Error(`Error while reading 'memo.json': ${error}`);
    }
};

export const writeMemoFile = async (memoFileContent: {
    [key: string]: any;
}): Promise<void> => {
    try {
        await writeFile(
            join(process.cwd(), "memo.json"),
            JSON.stringify(memoFileContent),
            "utf8"
        );
    } catch (error) {
        throw Error(`Error while modifying 'memo.json': ${error}`);
    }
};

export const checkMemo = async ({
    keys,
    category,
}: CheckMemoProps): Promise<MemoValues | null> => {
    try {
        const result: MemoValues = {};
        const memoFileContent: { [key: string]: any } = JSON.parse(
            await readFile("memo.json", "utf8")
        );

        const curCategory = memoFileContent[category];

        if (curCategory) {
            keys.forEach((key) => {
                const value = curCategory[key];
                value && (result[key] = value);
            });
        } else {
            throw new Error(
                `Couldn't reach the category ${category} from 'memo.json'`
            );
        }

        return result;
    } catch (error) {
        specialLog({
            situation: "ERROR",
            message: `an error occurred while modifying the 'memo.json' file: ${error}`,
        });
        return null;
    }
};

export const memosToQuestions = (
    memoValues: MemoValues,
    questions: QuestionQuery[]
): QuestionCollection<any>[] => {
    try {
        return questions.map((question) => {
            const modifiedQues = { ...question };
            const { name } = question as QuestionQuery;

            memoValues[name] && (modifiedQues.default = memoValues[name]);

            return modifiedQues as QuestionCollection<any>;
        });
    } catch (error) {
        specialLog({
            situation: "ERROR",
            message: `${error}`,
            scope: "memosToQuestions",
        });
        process.exit(1);
    }
};

export const memorizer = async ({ pairs, category }: MemorizerProps) => {
    try {
        const memoFileContent = await readMemoFile(category);

        Object.entries(pairs).forEach((pair) => {
            const [key, value] = pair;
            memoFileContent[category][key] = value;
        });

        await writeMemoFile(memoFileContent);
    } catch (error) {
        specialLog({
            situation: "ERROR",
            message: `${error}`,
            scope: "memorizer",
        });
    }
};

export const memorizeTable = async ({
    tableName,
    category,
}: {
    tableName: string;
    category: MemoCategory;
}): Promise<void> => {
    try {
        const memoFileContent = await readMemoFile(category);

        memoFileContent[category]["tables"][tableName] = {
            ...(memoFileContent[category]["tables"][tableName] || {}),
        };

        await writeMemoFile(memoFileContent);
    } catch (error) {
        specialLog({
            situation: "ERROR",
            message: `Error while memorizing the table: ${error}`,
        });
    }
};

export const memorizeColumn = async ({
    columnName,
    tableName,
    category,
}: {
    columnName: string;
    tableName: string;
    category: MemoCategory;
}): Promise<void> => {
    try {
        const memoFileContent = await readMemoFile(category);

        memoFileContent[category]["tables"][tableName][columnName] = {
            ...(memoFileContent[category]["tables"][tableName][columnName] ||
                {}),
        };

        await writeMemoFile(memoFileContent);
    } catch (error) {
        specialLog({
            situation: "ERROR",
            message: `Error while memorizing the column: ${error}`,
        });
    }
};

export const memorizeAction = async (actionTag: ActionTag) => {};
