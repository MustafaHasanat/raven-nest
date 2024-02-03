import { existsSync } from "fs";

const inputTrimmer = (input: string) => input.trim();

const dirFilter = (dir: string) => !existsSync(process.cwd() + "/" + dir);

export { inputTrimmer, dirFilter };
