"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folder_1 = require("../../dist/code/folder");
const folder_2 = require("../code/folder");
const router = express_1.default.Router();
// For Getting Images List in Certain Folder
router.get("/images", (req, res) => {
    if (!req.query || !req.query.folder || typeof req.query.folder !== "string") {
        res.status(400).send();
        return;
    }
    if (req.query.folder.match(/[^\w\d\s_-]/)) {
        res.status(400).send({
            message: "This is not for ctf..."
        });
        return;
    }
    const image_list = (0, folder_1.getImageList)(req.query.folder);
    if (!image_list) {
        res.status(400).send("Something went wrong while gettings images");
    }
    else {
        res.status(200).send(image_list);
    }
});
router.post("/rename_image", (req, res) => {
    if (!req.body || !req.body.folder || !req.body.from || !req.body.to) {
        res.status(400).send();
        return;
    }
    if (req.body.from.match(/[^\w\d\s._-]/) || req.body.to.match(/[^\w\d\s._-]/)) {
        res.status(400).send({
            message: "No Special Symbols except '-' and '_'."
        });
        return;
    }
    const err_message = (0, folder_2.renameImage)(req.body.folder, req.body.from, req.body.to);
    if (err_message) {
        res.status(400).send(err_message);
    }
    else {
        res.status(200).send();
    }
});
router.post("/rename_images", (req, res) => {
    if (!req.body || !req.body.folder || !req.body.images || !Array.isArray(req.body.images) || !req.body.to) {
        res.status(400).send();
        return;
    }
    for (let i = 0; i < req.body.images.length; i++) {
        if (req.body.images[i].match(/[^\w\d\s._%-]/)) {
            res.status(400).send({
                message: "No Special Symbols except '-' and '_'."
            });
            return;
        }
    }
    if (req.body.to.match(/[^\w\d\s.,_%()-]/)) {
        res.status(400).send({
            message: "No Special Symbols except '-' and '_'."
        });
        return;
    }
    const err_message = (0, folder_2.renameImages)(req.body.folder, req.body.images, req.body.to);
    ;
    if (err_message) {
        res.status(400).send(err_message);
    }
    else {
        res.status(200).send();
    }
});
router.post("/delete_image", (req, res) => {
    if (!req.body || !req.body.folder || !req.body.images || !Array.isArray(req.body.images)) {
        res.status(400).send({
            message: "Invalid Request"
        });
        return;
    }
    const err_message = (0, folder_2.deleteImage)(req.body.folder, req.body.images);
    if (err_message) {
        res.status(400).send(err_message);
    }
    else {
        res.status(200).send();
    }
});
exports.default = router;
