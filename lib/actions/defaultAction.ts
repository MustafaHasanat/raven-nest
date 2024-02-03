import { Command, OptionValues } from "commander";
import figlet from "figlet";

const defaultAction = (app: Command, options: OptionValues) => {
    const optionsArray = Object.keys(options);

    // if there was no option selected, show the logo with the instructions for -h
    if (optionsArray.length === 0) {
        console.log(figlet.textSync("Eagle Nest"));
        app.outputHelp();
        console.log("\n\n");
        return;
    }
};

export default defaultAction;
