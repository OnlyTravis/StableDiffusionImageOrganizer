"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderList = getFolderList;
exports.createFolder = createFolder;
exports.renameFolder = renameFolder;
exports.deleteFolder = deleteFolder;
exports.getImageList = getImageList;
exports.renameImage = renameImage;
exports.renameImages = renameImages;
exports.deleteImage = deleteImage;
exports.moveImage = moveImage;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const settings_1 = require("./settings");
let folder_list = require("../../data/folders_list.json");
function toNumLength(num, len) {
    let str = num.toString();
    return (new Array((len - str.length) > 0 ? (len - str.length) : 0)).fill('0').join('') + str;
}
function getFolderIndex(folder_name) {
    return folder_list.findIndex((folder_obj) => folder_obj.folder_name === folder_name);
}
function updateFolderList() {
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "../../data/folders_list.json"), JSON.stringify(folder_list));
}
function getFolderList() {
    return folder_list;
}
function createFolder(folder_name) {
    if (fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folder_name)))
        return false;
    fs_1.default.mkdirSync(path_1.default.join(process.env.OUTPUT_PATH, folder_name));
    folder_list.push({
        folder_name: folder_name,
        image_count: 0
    });
    folder_list = folder_list.sort((a, b) => a.folder_name > b.folder_name ? 1 : -1);
    updateFolderList();
    return true;
}
function renameFolder(from, to) {
    if (to === "_tmp_")
        return "Folder Name '_tmp_' is reserved for batch renaming images.";
    if (!fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, from)))
        return "The folder you're trying to rename does not exists.";
    if (fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, to)))
        return "There is already other folder with that name.";
    const index = folder_list.findIndex((folder) => folder.folder_name === from);
    folder_list[index].folder_name = to;
    folder_list = folder_list.sort((a, b) => a.folder_name > b.folder_name ? 1 : -1);
    updateFolderList();
    fs_1.default.renameSync(path_1.default.join(process.env.OUTPUT_PATH, from), path_1.default.join(process.env.OUTPUT_PATH, to));
    return "";
}
function deleteFolder(folders) {
    for (let i = 0; i < folders.length; i++) {
        if (!fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folders[i]))) {
            return "Atleast 1 of the folder you are trying to delete does not exists.";
        }
    }
    for (let i = 0; i < folders.length; i++) {
        const index = folder_list.findIndex((folder) => folder && folder.folder_name === folders[i]);
        folder_list[index] = undefined;
        fs_1.default.rmdirSync(path_1.default.join(process.env.OUTPUT_PATH, folders[i]));
    }
    folder_list = folder_list.filter((folder) => folder !== undefined);
    updateFolderList();
    return "";
}
function getImageList(folder) {
    if (!fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folder)))
        return;
    const file_list = fs_1.default.readdirSync(path_1.default.join(process.env.OUTPUT_PATH, folder));
    const allowed_extensions = (0, settings_1.getSettings)("allowed_image_extensions");
    file_list.filter((file_name) => {
        const tmp = file_name.split(".");
        const extension = tmp[tmp.length - 1];
        return (allowed_extensions.findIndex((ex) => ex === extension) !== -1);
    });
    const index = getFolderIndex(folder);
    if (index === -1) {
        console.log("Error: Couldn't find folder in folder_list.json in getImageList in /src/code/folder.ts.");
        return file_list;
    }
    if (file_list.length !== folder_list[index]) {
        folder_list[index].image_count = file_list.length;
        updateFolderList();
    }
    return file_list;
}
function renameImage(folder, from, to) {
    if (!fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folder, from))) {
        return "The image you're trying to rename does not exists.";
    }
    if (fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folder, to))) {
        return "There is already other image with that name.";
    }
    fs_1.default.renameSync(path_1.default.join(process.env.OUTPUT_PATH, folder, from), path_1.default.join(process.env.OUTPUT_PATH, folder, to));
    return "";
}
function renameImages(folder, images, to) {
    // 1. Sort Selected Images
    images = images.sort((a, b) => (a > b) ? 1 : -1);
    // 2. Check if params is good
    if (!to.match(/(%n\((\s*\d+\s*,){2}(\s*\d+\s*)\))+/)) {
        return "Please use atleast one counter to avoid file name conflict.";
    }
    for (let i = 0; i < images.length; i++) {
        if (!fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folder, images[i]))) {
            return "The image you're trying to rename does not exists.";
        }
    }
    // 3. Extract & check params of counters
    const params = [];
    const reg_result = [...to.matchAll(/(%n\((\s*\d+\s*,){2}(\s*\d+\s*)\))+/g)];
    for (let i = 0; i < reg_result.length; i++) {
        to = to.replaceAll(reg_result[i][0], "&&&");
        const arr = reg_result[i][0].slice(3, reg_result[i][0].length - 1).split(",");
        params.push(arr.map((n) => parseInt(n)));
        if (params[params.length - 1][1] <= 0 || params[params.length - 1][2] === 0) {
            return "Invalid Counter Parameters.";
        }
    }
    // 4. Check for conflicts (to: imageblablabla_&&&_&&&)
    let values = [];
    const new_names = [];
    for (let i = 0; i < params.length; i++) {
        values[i] = params[i][0];
    }
    for (let i = 0; i < images.length; i++) {
        // 4.1 Construct file name while incrementing counters
        const tmp = images[i].split(".");
        const extension = tmp[tmp.length - 1];
        let name = to;
        for (let j = 0; j < params.length; j++) {
            name = name.replace("&&&", toNumLength(values[j], params[j][1]));
            values[j] += params[j][2];
        }
        name += `.${extension}`;
        // 4.2 Check if file already exists or file is within the images pending to be renames
        if (images.findIndex((img) => img === name) === -1 && fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folder, name))) {
            return "There is already other image with that name.";
        }
        new_names.push(name);
    }
    // 5. Rename All Image Files Selected
    fs_1.default.mkdirSync(path_1.default.join(process.env.OUTPUT_PATH, "./_tmp_"));
    for (let i = 0; i < images.length; i++) {
        fs_1.default.renameSync(path_1.default.join(process.env.OUTPUT_PATH, folder, images[i]), path_1.default.join(process.env.OUTPUT_PATH, "./_tmp_", new_names[i]));
    }
    for (let i = 0; i < images.length; i++) {
        fs_1.default.renameSync(path_1.default.join(process.env.OUTPUT_PATH, "./_tmp_", new_names[i]), path_1.default.join(process.env.OUTPUT_PATH, folder, new_names[i]));
    }
    fs_1.default.rmdirSync(path_1.default.join(process.env.OUTPUT_PATH, "./_tmp_"));
    return "";
}
function deleteImage(folder, images) {
    for (let i = 0; i < images.length; i++) {
        if (!fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folder, images[i]))) {
            return "Atleast 1 of the image you are trying to delete does not exists.";
        }
    }
    for (let i = 0; i < images.length; i++) {
        fs_1.default.unlinkSync(path_1.default.join(process.env.OUTPUT_PATH, folder, images[i]));
    }
    const index = getFolderIndex(folder);
    folder_list[index].image_count -= images.length;
    updateFolderList();
    return "";
}
function moveImage(folder, destination, images) {
    for (let i = 0; i < images.length; i++) {
        if (!fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, folder, images[i]))) {
            return "Atleast 1 of the image you are trying to delete does not exists.";
        }
    }
    for (let i = 0; i < images.length; i++) {
        if (fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, destination, images[i]))) {
            return "Atleast 1 image with the same name already exist in the destination folder.";
        }
    }
    for (let i = 0; i < images.length; i++) {
        fs_1.default.renameSync(path_1.default.join(process.env.OUTPUT_PATH, folder, images[i]), path_1.default.join(process.env.OUTPUT_PATH, destination, images[i]));
    }
    const index_1 = getFolderIndex(folder);
    const index_2 = getFolderIndex(destination);
    folder_list[index_1].image_count -= images.length;
    folder_list[index_2].image_count += images.length;
    updateFolderList();
    return "";
}
