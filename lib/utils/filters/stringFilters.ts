import { existsSync } from "fs";
import { join } from "path";

const inputTrimmer = (input: string) => input.trim();

const dirFilter = (dir: string) =>
    dir && typeof dir === "string"
        ? existsSync(join(process.cwd(), dir))
        : false;

export { inputTrimmer, dirFilter };
