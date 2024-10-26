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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const settings_1 = require("./settings");
let folder_list = require("../../data/folders_list.json");
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
    updateFolderList();
    return true;
}
function renameFolder(from, to) {
    if (!fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, from))) {
        return "The folder you're trying to rename does not exists.";
    }
    if (fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, to))) {
        return "There is already other folder with that name.";
    }
    const index = folder_list.findIndex((folder) => folder.folder_name === from);
    folder_list[index].folder_name = to;
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
    return file_list;
}
