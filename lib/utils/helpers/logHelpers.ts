import { RGB } from "../../enums/rgb.js";
import { getColoredText } from "./coloringLog.js";
import constants from "../constants/coloringConstants.js";

const { colors } = constants;

interface SpecialLogProps {
    message: string;
    situation: "RESULT" | "PROCESS" | "MESSAGE" | "ERROR";
    headerColor?: RGB;
    scope?: string;
    isBreak?: boolean;
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

export { specialLog, logNumberedList };
