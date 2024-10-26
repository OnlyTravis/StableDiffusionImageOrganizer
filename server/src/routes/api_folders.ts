import express from 'express';
import path from 'path';
import fs from 'fs';

import { createFolder, deleteFolder, getFolderList, renameFolder } from '../code/folder';

// (12, 6) ---> "000012"
function toNumLength(num: number, len: number): string {
    let str: string = num.toString();

    return (new Array((len-str.length)>0?(len-str.length):0)).fill('0').join('')+str;
}


const router = express.Router();

// For getting folder list in main folder
router.get("/folder_list", (req, res) => {
    res.json(getFolderList());
});

// For creating new folder
const default_folder_name = "New_Folder";
router.post("/create_folder", (req, res) => {
    let num = 0;
    while (fs.existsSync(path.join(process.env.OUTPUT_PATH, `New_Folder_${toNumLength(num, 5)}`))) {
        num++;
    }

    createFolder(`New_Folder_${toNumLength(num, 5)}`);

    res.status(200).send();
});

// For renaming folder
router.post("/rename_folder", (req, res) => {
    if (!req.body || !req.body.from || !req.body.to) {
        res.status(400).send({
            message: "Invalid Request"
        });
        return;
    }

    if (req.body.from.match(/[^\w\d\s_-]/) || req.body.to.match(/[^\w\d\s_-]/)) {
        res.status(400).send({
            message: "No Special Symbols except '-' and '_'."
        });
        return;
    }

    const err_message = renameFolder(req.body.from, req.body.to);
    if (err_message) {
        res.status(400).send(err_message);
    } else {
        res.status(200).send();
    }

});

// For deleting Folder
router.post("/delete_folder", (req, res) => {
    if (!req.body || !req.body.folders || !Array.isArray(req.body.folders)) {
        res.status(400).send({
            message: "Invalid Request"
        });
        return;
    }

    const err_message = deleteFolder(req.body.folders);
    if (err_message) {
        res.status(400).send(err_message);
    } else {
        res.status(200).send();
    }
});

export default router;