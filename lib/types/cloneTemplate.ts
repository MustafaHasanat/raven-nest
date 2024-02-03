type CloneTemplate = {
    signature: string;
    target: string;
    destination: string;
    newFileName: string;
    replacements?: {
        oldString: string;
        newString: string;
    }[];
};

export { CloneTemplate };
