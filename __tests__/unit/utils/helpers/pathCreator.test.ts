import { pathCreator } from "../../../../lib/utils/helpers/pathCreator.js";
import fs from "fs";

jest.mock("fs");

describe("Testing pathCreator", () => {
    const existsSyncSpy = jest.spyOn(fs, "existsSync");
    const mkdirSyncSpy = jest.spyOn(fs, "mkdirSync");

    const testCase = "src/schemas/users";

    afterEach(() => {
        existsSyncSpy.mockRestore();
        mkdirSyncSpy.mockRestore();
    });

    it("should create the required files if only src exists", () => {
        existsSyncSpy.mockReturnValueOnce(true);
        pathCreator([testCase]);

        expect(existsSyncSpy).toHaveBeenCalledTimes(3);
        expect(existsSyncSpy).toHaveBeenCalledWith("src");
        expect(existsSyncSpy).toHaveBeenCalledWith("src/schemas");
        expect(existsSyncSpy).toHaveBeenCalledWith("src/schemas/users");

        expect(mkdirSyncSpy).toHaveBeenCalledTimes(2);
        expect(mkdirSyncSpy).toHaveBeenCalledWith("src/schemas");
        expect(mkdirSyncSpy).toHaveBeenCalledWith("src/schemas/users");
    });

    it("should create the required files if non of the folders exist", () => {
        existsSyncSpy.mockReturnValue(false);
        pathCreator([testCase]);

        expect(existsSyncSpy).toHaveBeenCalledTimes(3);
        expect(existsSyncSpy).toHaveBeenCalledWith("src");
        expect(existsSyncSpy).toHaveBeenCalledWith("src/schemas");
        expect(existsSyncSpy).toHaveBeenCalledWith("src/schemas/users");

        expect(mkdirSyncSpy).toHaveBeenCalledTimes(3);
        expect(mkdirSyncSpy).toHaveBeenCalledWith("src");
        expect(mkdirSyncSpy).toHaveBeenCalledWith("src/schemas");
        expect(mkdirSyncSpy).toHaveBeenCalledWith("src/schemas/users");
    });

    it("should not create anything if all folders exist", () => {
        existsSyncSpy.mockReturnValue(true);
        pathCreator([testCase]);

        expect(existsSyncSpy).toHaveBeenCalledTimes(3);
        expect(existsSyncSpy).toHaveBeenCalledWith("src");
        expect(existsSyncSpy).toHaveBeenCalledWith("src/schemas");
        expect(existsSyncSpy).toHaveBeenCalledWith("src/schemas/users");

        expect(mkdirSyncSpy).toHaveBeenCalledTimes(0);
    });
});
