import * as fs from "fs";

export const getFilesRecursive = (folderPath: string): string[] => {
    let fileNames: string[] = [];
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        const fullPath = `${folderPath}/${file}`;
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            fileNames = fileNames.concat(getFilesRecursive(fullPath));
        } else {
            fileNames.push(fullPath);
        }
    });

    return fileNames;
};
