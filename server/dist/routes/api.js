"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folders_list_json_1 = __importDefault(require("../../data/folders_list.json"));
const router = express_1.default.Router();
router.get("/folder_list", (req, res) => {
    res.json(folders_list_json_1.default);
});
exports.default = router;
