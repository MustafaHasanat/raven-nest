import { InjectTemplate } from "../../types/injectTemplate";
import { CloneTemplate } from "../../types/cloneTemplate";
import { join } from "path";

const initDockerCloning = (projectName: string): CloneTemplate[] => [
    {
        signature: "docker-compose.yaml",
        target: "base/others/dockerCompose-file.txt",
        newFileName: "docker-compose.yaml",
        destination: ".",
        replacements: [
            {
                oldString: "PROJECT_NAME",
                newString: projectName,
            },
        ],
    },
    {
        signature: "Dockerfile",
        target: "base/others/dockerfile.txt",
        newFileName: "Dockerfile",
        destination: ".",
    },
    {
        signature: ".dockerignore",
        target: "base/others/dockerignore-file.txt",
        newFileName: ".dockerignore",
        destination: ".",
    },
];

const initDockerInjection = (rootDir: string): InjectTemplate[] => [
    {
        injectable: join(rootDir, ".env"),
        signature: ".env",
        deletions: [
            {
                keyword: "DATABASE_HOST=localhost",
                deletion: {
                    conditional: {
                        type: "REPLACED_WITH",
                        data: "DATABASE_HOST=postgres-db",
                    },
                },
            },
        ],
    },
];

export { initDockerCloning, initDockerInjection };
