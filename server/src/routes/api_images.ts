import express from 'express';
import path from 'path';
import fs from 'fs';

import { getImageList } from '../../dist/code/folder';
import { deleteImage, moveImage, renameImage, renameImages } from '../code/folder';

const router = express.Router();

// For Getting Images List in Certain Folder
router.get("/images", (req, res) => {
    if (!req.query || !req.query.folder || typeof req.query.folder !== "string") {
        res.status(400).send();
        return;
    }

    if (req.query.folder.match(/[^\w\d\s_-]/)) {
        res.status(400).send("This is not for ctf...");
        return;
    }

    const image_list = getImageList(req.query.folder);
    if (!image_list) {
        res.status(400).send("Something went wrong while gettings images");
    } else {
        res.status(200).send(image_list);
    }
});

router.post("/rename_image", (req, res) => {
    if (!req.body || !req.body.folder || !req.body.from || !req.body.to) {
        res.status(400).send();
        return;
    }

    if (req.body.from.match(/[^\w\d\s._-]/) || req.body.to.match(/[^\w\d\s._-]/)) {
        res.status(400).send("No Special Symbols except '-' and '_'.");
        return;
    }

    const err_message = renameImage(req.body.folder, req.body.from, req.body.to);
    if (err_message) {
        res.status(400).send(err_message);
    } else {
        res.status(200).send();
    }
});

router.post("/rename_images", (req, res) => {
    if (!req.body || !req.body.folder || !req.body.images || !Array.isArray(req.body.images) || !req.body.to) {
        res.status(400).send();
        return;
    }

    for (let i = 0; i < req.body.images.length; i++) {
        if (req.body.images[i].match(/[^\w\d\s._%()-]/)) {
            res.status(400).send("No Special Symbols except '.-_()'.");
            return;    
        }
    }
    if (req.body.to.match(/[^\w\d\s.,_%()-]/)) {
        res.status(400).send("No Special Symbols except '.-_()'.");
        return;
    }

    const err_message = renameImages(req.body.folder, req.body.images, req.body.to);;
    if (err_message) {
        res.status(400).send(err_message);
    } else {
        res.status(200).send();
    }
});

router.post("/delete_image", (req, res) => {
    if (!req.body || !req.body.folder || !req.body.images || !Array.isArray(req.body.images)) {
        res.status(400).send("Invalid Request");
        return;
    }

    const err_message = deleteImage(req.body.folder, req.body.images);
    if (err_message) {
        res.status(400).send(err_message);
    } else {
        res.status(200).send();
    }
});

router.post("/move_image", (req, res) => {
    if (!req.body || !req.body.folder || !req.body.destination || !req.body.images || !Array.isArray(req.body.images)) {
        res.status(400).send("Invalid Request");
        return;
    }

    const err_message = moveImage(req.body.folder, req.body.destination, req.body.images);
    if (err_message) {
        res.status(400).send(err_message);
    } else {
        res.status(200).send();
    }
});

export default router;