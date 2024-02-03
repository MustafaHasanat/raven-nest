import { RGB } from "../../enums/rgb.js";

const rgbToANSI = (attribute: "color" | "bgColor", rgb: RGB) =>
    "\x1b[" +
    (attribute === "color" ? "38" : "48") +
    ";2;" +
    `${rgb.red};${rgb.green};${rgb.blue}` +
    "m";

const getColoredText = (text: string, color: RGB) => {
    return rgbToANSI("color", color) + text + "\x1b[0m";
};

const getBgColoredText = (text: string, bgColor: RGB) => {
    return rgbToANSI("bgColor", bgColor) + text + "\x1b[0m";
};

export { rgbToANSI, getBgColoredText, getColoredText };
