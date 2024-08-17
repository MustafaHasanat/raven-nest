import dockerizeInitBuilder from "../builder/docker/dockerizeInitBuilder.js";
import { preAction } from "../utils/helpers/preActionProcesses.js";
import { MemoValues } from "actions";
import { specialLog } from "../utils/helpers/logHelpers.js";

export default async function dockerizeAction() {
    try {
        await preAction({
            memos: ["projectName"],
            builder: (memoValues: MemoValues) => dockerizeInitBuilder(memoValues),
        });
    } catch (error) {
        specialLog({
            message: `${error}`,
            situation: "ERROR",
            scope: "dockerizeAction",
        });
        return;
    }
}
