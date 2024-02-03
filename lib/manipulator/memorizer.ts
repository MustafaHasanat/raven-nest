import { specialLog } from "../utils/helpers/logHelpers.js";
import { MemoCategory } from "../enums/actions.js";
import { readFile, writeFile } from "fs/promises";
import { MemoValues, QuestionQuery } from "../types/actions.js";
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

const checkMemo = async ({
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

const memosToQuestions = (
    memoValues: MemoValues,
    questions: QuestionQuery[]
): QuestionCollection<any>[]=> {
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

const memorizer = async ({ pairs, category }: MemorizerProps) => {
    try {
        const memoFileContent: { [key: string]: any } = JSON.parse(
            await readFile("memo.json", "utf8")
        );
        !!!memoFileContent[category] && (memoFileContent[category] = {});

        Object.entries(pairs).forEach((pair) => {
            const [key, value] = pair;
            memoFileContent[category][key] = value;
        });

        await writeFile(
            join(process.cwd(), "memo.json"),
            JSON.stringify(memoFileContent),
            "utf8"
        );
    } catch (error) {
        specialLog({
            situation: "ERROR",
            message: `${error}`,
            scope: "memorizer",
        });
    }
};

export { checkMemo, memorizer, memosToQuestions };
