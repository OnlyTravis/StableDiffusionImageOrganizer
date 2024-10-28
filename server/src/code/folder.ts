import path from 'path';
import fs from 'fs';

import { getSettings } from './settings';

let folder_list = require("../../data/folders_list.json");

function toNumLength(num: number, len: number): string {
    let str: string = num.toString();

    return (new Array((len-str.length)>0?(len-str.length):0)).fill('0').join('')+str;
}

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
    folder_list = folder_list.sort((a, b) => a.folder_name > b.folder_name?1:-1);
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
    folder_list = folder_list.sort((a, b) => a.folder_name > b.folder_name?1:-1);
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

export function renameImage(folder: string, from: string, to: string) {
    if (!fs.existsSync(path.join(process.env.OUTPUT_PATH, folder, from))) {
        return "The image you're trying to rename does not exists.";
    }

    if (fs.existsSync(path.join(process.env.OUTPUT_PATH, folder, to))) {
        return "There is already other image with that name.";
    }

    fs.renameSync(path.join(process.env.OUTPUT_PATH, folder, from), path.join(process.env.OUTPUT_PATH, folder, to));

    return "";
}

export function renameImages(folder: string, images: string[], to: string) {
    // 1. Sort Selected Images
    images = images.sort((a, b) => (a>b)?1:-1);

    // 2. Check if params is good
    if (!to.match(/(%n\(\d+,\d+,\d+\))+/)) {
        return "Please use atleast one counter to avoid file name conflict.";
    }
    for (let i = 0; i < images.length; i++) {
        if (!fs.existsSync(path.join(process.env.OUTPUT_PATH, folder, images[i]))) {
            return "The image you're trying to rename does not exists.";
        }
    }

    // 3. Extract params of counters
    const params = [];
    const reg_result = [...to.matchAll(/(%n\(\d+,\d+,\d+\))+/g)];
    for (let i = 0; i < reg_result.length; i++) {
        to = to.replaceAll(reg_result[i][0], "&&&");

        const arr = reg_result[i][0].split(",");
        arr[0] = arr[0].slice(3);
        arr[2] = arr[2].slice(0, arr[2].length-1);
        params.push(arr.map((n) => parseInt(n)));
    }

    // 4. Check for conflicts (to: imageblablabla_&&&_&&&)
    let values = [];
    for (let i = 0; i < params.length; i++) {
        values[i] = params[i][0];
    }
    for (let i = 0; i < images.length; i++) {
        // 4.1 Construct file name while incrementing counters
        const tmp = images[i].split(".");
        const extension = tmp[tmp.length-1];
        let name = to;
        for (let j = 0; j < params.length; j++) {
            name = name.replace("&&&", toNumLength(values[j], params[j][1]));
            values[j] += params[j][2];
        }
        name += `.${extension}`;

        // 4.2 Check if file already exists or file is within the images pending to be renames
        if (images.findIndex((img) => img === name) === -1 && fs.existsSync(path.join(process.env.OUTPUT_PATH, folder, name))) {
            return "There is already other image with that name.";
        }
    }
    
    // 5. Rename All Image Files Selected
    for (let i = 0; i < params.length; i++) {
        values[i] = params[i][0];
    }
    for (let i = 0; i < images.length; i++) {
        const tmp = images[i].split(".");
        const extension = tmp[tmp.length-1];
        let name = to;
        for (let j = 0; j < params.length; j++) {
            name = name.replace("&&&", toNumLength(values[j], params[j][1]));
            values[j] += params[j][2];
        }
        name += `.${extension}`;

        fs.renameSync(path.join(process.env.OUTPUT_PATH, folder, images[i]), path.join(process.env.OUTPUT_PATH, folder, name));
    }

    return "";
}

export function deleteImage(folder: string, images: string[]): string {
    for (let i = 0; i < images.length; i++) {
        if (!fs.existsSync(path.join(process.env.OUTPUT_PATH, folder, images[i]))) {
            return "Atleast 1 of the image you are trying to delete does not exists.";
        }
    }

    for (let i = 0; i < images.length; i++) {   
        fs.unlinkSync(path.join(process.env.OUTPUT_PATH, folder, images[i]));
    }

    return "";
}

export function moveImage(folder: string, destination: string, images: string[]): string {
    for (let i = 0; i < images.length; i++) {
        if (!fs.existsSync(path.join(process.env.OUTPUT_PATH, folder, images[i]))) {
            return "Atleast 1 of the image you are trying to delete does not exists.";
        }
    }
    for (let i = 0; i < images.length; i++) {
        if (fs.existsSync(path.join(process.env.OUTPUT_PATH, destination, images[i]))) {
            return "Atleast 1 image with the same name already exist in the destination folder.";
        }
    }

    for (let i = 0; i < images.length; i++) {   
        fs.renameSync(path.join(process.env.OUTPUT_PATH, folder, images[i]), path.join(process.env.OUTPUT_PATH, destination, images[i]));
    }

    return "";
}