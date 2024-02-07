import { DockerFileSetArgument } from "../enums/actions.js";
import dockerInitBuilder from "../builder/dockerAction/dockerInitBuilder.js";

export default async function dockerAction(filesSet: DockerFileSetArgument) {
    switch (filesSet) {
        case DockerFileSetArgument.INIT:
            await dockerInitBuilder();
            break;
        default:
            break;
    }
}
