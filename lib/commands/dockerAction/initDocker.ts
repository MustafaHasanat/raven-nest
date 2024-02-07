import { CloneTemplate } from "../../types/cloneTemplate";

const initDockerCloning = (): CloneTemplate[] => [
    {
        signature: "docker-compose.yaml",
        target: "base/others/dockerCompose-file.txt",
        newFileName: "docker-compose.yaml",
        destination: ".",
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

export { initDockerCloning };
