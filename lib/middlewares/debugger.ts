import { AppOptions } from "app";
import { readConfigFile, writeConfigFile } from "../engines/memorizer.js";
import { ConfigCategory } from "../enums/actions.js";
import { getColoredText } from "../utils/helpers/coloringLog.js";
import constants from "../utils/constants/coloring.js";

const handleDebugger = async (options: AppOptions) => {
    const { mode } = options;

    const configFileContent = await readConfigFile(ConfigCategory.RAVEN_NEST);

    if (mode !== "debug") {
        configFileContent[ConfigCategory.RAVEN_NEST]["debugger"] = false;
        return;
    }

    const { colors } = constants;

    process.stdout.write(
        getColoredText("\n======= DEBUGGING MODE IS ON =======\n", colors.blue)
    );

    configFileContent[ConfigCategory.RAVEN_NEST]["debugger"] = true;

    await writeConfigFile(configFileContent);
};

const getIsDebugging = async () => {
    const configFileContent = await readConfigFile(ConfigCategory.RAVEN_NEST);

    return !!configFileContent[ConfigCategory.RAVEN_NEST]["debugger"];
};

export { handleDebugger, getIsDebugging };
