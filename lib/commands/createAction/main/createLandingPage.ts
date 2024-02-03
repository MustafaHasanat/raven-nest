import { join } from "path";
import { CloneTemplate } from "../../../types/cloneTemplate.js";

const createLandingPageCloning = (
    publicDir: string,
    name: string
): CloneTemplate[] => [
    {
        signature: "public/index.html",
        target: "base/html/landing-page.txt",
        destination: publicDir,
        newFileName: "index.html",
        replacements: [
            {
                oldString: "PROJECT_NAME",
                newString: name,
            },
        ],
    },
    {
        signature: "public/styles/main.css",
        target: "base/css/landing-page.txt",
        destination: join(publicDir, "styles"),
        newFileName: "main.css",
    },
];

export { createLandingPageCloning };
