"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const folder_1 = require("../code/folder");
// (12, 6) ---> "000012"
function toNumLength(num, len) {
    let str = num.toString();
    return (new Array((len - str.length) > 0 ? (len - str.length) : 0)).fill('0').join('') + str;
}
const router = express_1.default.Router();
// For getting folder list in main folder
router.get("/folder_list", (req, res) => {
    res.json((0, folder_1.getFolderList)());
});
// For creating new folder
const default_folder_name = "New_Folder";
router.post("/create_folder", (req, res) => {
    let num = 0;
    while (fs_1.default.existsSync(path_1.default.join(process.env.OUTPUT_PATH, `New_Folder_${toNumLength(num, 5)}`))) {
        num++;
    }
    (0, folder_1.createFolder)(`New_Folder_${toNumLength(num, 5)}`);
    res.status(200).send();
});
// For renaming folder
router.post("/rename_folder", (req, res) => {
    if (!req.body || !req.body.from || !req.body.to) {
        res.status(400).send("Invalid Request");
        return;
    }
    if (req.body.from.match(/[^\w\d\s_-]/) || req.body.to.match(/[^\w\d\s_-]/)) {
        res.status(400).send("No Special Symbols except '-' and '_'.");
        return;
    }
    const err_message = (0, folder_1.renameFolder)(req.body.from, req.body.to);
    if (err_message) {
        res.status(400).send(err_message);
    }
    else {
        res.status(200).send();
    }
});
// For deleting Folder
router.post("/delete_folder", (req, res) => {
    if (!req.body || !req.body.folders || !Array.isArray(req.body.folders)) {
        res.status(400).send("Invalid Request");
        return;
    }
    const err_message = (0, folder_1.deleteFolder)(req.body.folders);
    if (err_message) {
        res.status(400).send(err_message);
    }
    else {
        res.status(200).send();
    }
});
exports.default = router;
