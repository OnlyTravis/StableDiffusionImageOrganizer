"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.get("/is_loggedIn", (req, res) => {
    if (!req.cookies || !req.cookies.jwt) {
        res.status(200).json({ logged_in: false });
        return;
    }
    jsonwebtoken_1.default.verify(req.cookies.jwt, process.env.SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(200).json({ logged_in: false });
            return;
        }
        res.status(200).json({ logged_in: true });
    });
});
router.all("/*", (req, res, next) => {
    if (!req.cookies || !req.cookies.jwt) {
        res.status(401).send("No Peeking");
        return;
    }
    jsonwebtoken_1.default.verify(req.cookies.jwt, process.env.SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(401).send("No Peeking");
            return;
        }
        next();
    });
});
exports.default = router;
