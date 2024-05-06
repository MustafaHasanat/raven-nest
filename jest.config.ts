import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    rootDir: "./__tests__",
    verbose: true,
    // collectCoverage: true,
    collectCoverageFrom: ["lib/**/*.(ts|js|txt)"],
    testMatch: ["**/**/?(*.)+(test).+(ts|js)"],
    moduleFileExtensions: ["ts", "js", "tsx", "jsx", "json", "node"],
    moduleNameMapper: {
        // '^@/(.*)$': './lib/$1',
        "(.+)\\.(ts|js)": "$1",
    },
    transform: {
        "^.+\\.(t|j)sx?$": "ts-jest",
        // "^.+\\.tsx?$": "ts-jest",
        // "^.+\\.ts?$": "ts-jest",
    },
    testPathIgnorePatterns: ["/node_modules/", "/bin/"],
};
export default config;
