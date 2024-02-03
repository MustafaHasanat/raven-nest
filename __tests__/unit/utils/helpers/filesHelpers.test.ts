import {
    firstCharToLower,
    firstCharToUpper,
    missingFiles,
    pathConvertor,
    pluralize,
} from "../../../../lib/utils/helpers/filesHelpers.js";
import fs from "fs";

jest.mock("fs");

describe("Testing pathConvertor", () => {
    it("should return the correct result when calling pathConvertor", () => {
        expect(pathConvertor("src", "entities")).toEqual("src/entities");
        expect(pathConvertor(".", "entities")).toEqual("./entities");
        expect(pathConvertor("", "entities")).toEqual("entities");
    });
});

describe("Testing missingFiles", () => {
    const existsSyncSpy = jest.spyOn(fs, "existsSync");

    afterEach(() => {
        existsSyncSpy.mockRestore();
    });

    it("should return the correct result if the files exist", () => {
        existsSyncSpy.mockReturnValue(true);
        expect(missingFiles(["src/myfile.ts", "src/myfile2.ts"])).toEqual([]);
    });

    it("should return the correct result if the files don't exist", () => {
        existsSyncSpy.mockReturnValue(false);
        expect(missingFiles(["src/myfile.ts", "src/myfile2.ts"])).toEqual([
            "src/myfile.ts",
            "src/myfile2.ts",
        ]);
    });

    it("should return the correct result if some of the files don't exist", () => {
        existsSyncSpy.mockReturnValueOnce(false);
        existsSyncSpy.mockReturnValueOnce(true);
        existsSyncSpy.mockReturnValueOnce(false);

        expect(
            missingFiles(["src/myfile.ts", "src/myfile2.ts", "src/myfile3.ts"])
        ).toEqual(["src/myfile.ts", "src/myfile3.ts"]);
    });

    it("should return empty array if the input array is empty", () => {
        expect(missingFiles([])).toEqual([]);
    });
});

describe("Testing firstCharToUpper", () => {
    it("should capitalize the name", () => {
        expect(firstCharToUpper("user")).toEqual("User");
    });

    it("should through an error if the name is too short", () => {
        expect(() => firstCharToUpper("u")).toThrow("The string is too short!");
    });
});

describe("Testing firstCharToLower", () => {
    it("should lowercase the name", () => {
        expect(firstCharToLower("User")).toEqual("user");
    });

    it("should through an error if the name is too short", () => {
        expect(() => firstCharToLower("u")).toThrow("The string is too short!");
    });
});

describe("Testing pluralize", () => {
    it("should pluralize the name if it ends with an 's'", () => {
        expect(pluralize("class")).toEqual("classes");
    });

    it("should pluralize the name if it ends with a 'y'", () => {
        expect(pluralize("category")).toEqual("categories");
    });

    it("should pluralize the name if it didn't end with an 's' or a 'y'", () => {
        expect(pluralize("user")).toEqual("users");
    });
});
