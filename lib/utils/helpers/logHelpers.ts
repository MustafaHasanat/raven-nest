import { RGB } from "../../enums/rgb.js";
import { getColoredText } from "./coloringLog.js";
import constants from "../constants/coloring.js";
import { getIsDebugging } from "../../middlewares/debugger.js";

const { colors } = constants;

type Situation = "RESULT" | "PROCESS" | "MESSAGE" | "ERROR" | "DEBUGGER";

interface SpecialLogProps {
    message: string;
    headerColor?: RGB;
    scope?: string;
    isBreak?: boolean;
    situation: Situation;
}

const specialLog = ({
    message,
    situation,
    headerColor,
    scope,
    isBreak = false,
}: SpecialLogProps) => {
    const mappedSituation: {
        [situation: string]: { head: string; trail: string; color: RGB };
    } = {
        MESSAGE: { head: "MESSAGE", color: colors.yellow, trail: "." },
        RESULT: { head: "RESULT", color: colors.green, trail: " !" },
        PROCESS: { head: "PROCESS", color: colors.orange, trail: " ..." },
        ERROR: { head: "ERROR", color: colors.red, trail: " !!!" },
    };

    const finalColor: RGB = headerColor || mappedSituation[situation].color;

    const header = `\n| ${mappedSituation[situation].head} ${
        scope ? `(${scope})` : ""
    }: `;

    process.stdout.write(getColoredText(header, finalColor));
    console.log(
        `${message}${mappedSituation[situation].trail}${isBreak ? "\n" : ""}`
    );
};

const logNumberedList = (array: (string | number)[], isLog = true): string =>
    array
        .map((item, index) => {
            const current = `${index + 1}) ${item}`;
            isLog && console.log(current);

            return current;
        })
        .join("\n");

const debuggerLog = async ({
    messages,
    scope,
    extraCondition = true,
}: {
    messages: { [key: string]: string | Record<any, any> };
    scope?: string;
    isBreak?: boolean;
    extraCondition?: boolean;
}) => {
    const isDebugging = await getIsDebugging();
    const entries = Object.entries(messages);

    if (!isDebugging || !extraCondition || entries.length === 0) return;

    const header = `\n| DEBUGGER ${scope ? `(${scope})` : ""}: `;

    process.stdout.write(getColoredText(header, colors.blue));

    Promise.all(
        entries.map(([key, message]) => {
            console.log(`===== ${key} =====`);
            console.log(`${JSON.stringify(message)}`);
        })
    );
};

export { specialLog, logNumberedList, debuggerLog };
