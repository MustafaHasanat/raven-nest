import { DockerFileSetArgument } from "../enums/actions.js";
import dockerInitBuilder from "../builder/dockerAction/dockerInitBuilder.js";
import dockerDatabaseBuilder from "../builder/dockerAction/dockerDatabaseBuilder.js";

export default async function dockerAction(filesSet: DockerFileSetArgument) {
    switch (filesSet) {
        case DockerFileSetArgument.INIT:
            await dockerInitBuilder();
            break;
        case DockerFileSetArgument.DATABASE:
            await dockerDatabaseBuilder();
            break;
        default:
            break;
    }
}
