import { RGB } from "../../enums/rgb.js";

const coloringConstants: { colors: { [color: string]: RGB } } = {
    colors: {
        white: { red: 255, green: 255, blue: 255 },
        black: { red: 0, green: 0, blue: 0 },
        red: { red: 255, green: 0, blue: 0 },
        green: { red: 0, green: 255, blue: 0 },
        blue: { red: 0, green: 0, blue: 255 },
        yellow: { red: 255, green: 255, blue: 0 },
        orange: { red: 255, green: 165, blue: 0 },
        purple: { red: 128, green: 0, blue: 128 },
    },
};

export default coloringConstants;
