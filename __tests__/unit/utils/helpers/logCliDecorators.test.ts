// import { RGB } from "../../../../lib/enums/rgb.js";
import { specialLog } from "../../../../lib/utils/helpers/logHelpers.js";
// import constants from "../../../../lib/utils/constants/coloringConstants.js";
// import { getColoredText } from "../../../../lib/utils/helpers/coloringLog.js";

// const { colors } = constants;

// const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
const stdoutSpy = jest.fn();
// const getColoredTextSpy = jest.fn(getColoredText);

const originalStdoutWrite = process.stdout.write;

describe("testing specialLog", () => {
    beforeAll(() => {
        process.stdout.write = stdoutSpy;
    });
    afterAll(() => {
        process.stdout.write = originalStdoutWrite;
    });

    it("should log the correct message if a situation was RESULT", () => {
        specialLog({ message: "This is a result", situation: "RESULT" });

        // expect(getColoredTextSpy).toHaveBeenCalledWith(
        //     "\n| RESULT : ",
        //     colors.green
        // );

        // expect(consoleLogSpy).toHaveBeenCalledWith("This is a result !\n");
        // expect(stdoutSpy).toHaveBeenCalledWith("\n| RESULT : ");
    });
});
