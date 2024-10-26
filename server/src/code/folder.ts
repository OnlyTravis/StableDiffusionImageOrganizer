import path from 'path';
import fs from 'fs';

import { getSettings } from './settings';

let folder_list = require("../../data/folders_list.json");

function updateFolderList() {
    fs.writeFileSync(path.join(__dirname, "../../data/folders_list.json"), JSON.stringify(folder_list));
}

export function getFolderList() {
    return folder_list;
}

export function createFolder(folder_name: string): boolean {
    if (fs.existsSync(path.join(process.env.OUTPUT_PATH, folder_name))) return false;

    fs.mkdirSync(path.join(process.env.OUTPUT_PATH, folder_name));
    folder_list.push({
        folder_name : folder_name,
        image_count : 0
    });
    updateFolderList();

    return true;
}

export function renameFolder(from: string, to: string): string {
    if (!fs.existsSync(path.join(process.env.OUTPUT_PATH, from))) {
        return "The folder you're trying to rename does not exists.";
    }

    if (fs.existsSync(path.join(process.env.OUTPUT_PATH, to))) {
        return "There is already other folder with that name.";
    }

    const index = folder_list.findIndex((folder) => folder.folder_name === from);
    folder_list[index].folder_name = to;
    updateFolderList();

    fs.renameSync(path.join(process.env.OUTPUT_PATH, from), path.join(process.env.OUTPUT_PATH, to));

    return "";
}

export function deleteFolder(folders: string[]): string {
    for (let i = 0; i < folders.length; i++) {
        if (!fs.existsSync(path.join(process.env.OUTPUT_PATH, folders[i]))) {
            return "Atleast 1 of the folder you are trying to delete does not exists.";
        }
    }

    for (let i = 0; i < folders.length; i++) {
        const index = folder_list.findIndex((folder) => folder && folder.folder_name === folders[i]);
        folder_list[index] = undefined;
        
        fs.rmdirSync(path.join(process.env.OUTPUT_PATH, folders[i]));
    }
    folder_list = folder_list.filter((folder) => folder !== undefined);
    updateFolderList();

    return "";
}

export function getImageList(folder: string): string[] | void {
    if (!fs.existsSync(path.join(process.env.OUTPUT_PATH, folder))) return;

    const file_list = fs.readdirSync(path.join(process.env.OUTPUT_PATH, folder));
    const allowed_extensions = getSettings("allowed_image_extensions");
    file_list.filter((file_name) => {
        const tmp = file_name.split(".");
        const extension = tmp[tmp.length-1];

        return (allowed_extensions.findIndex((ex) => ex === extension) !== -1);
    });

    return file_list;
}