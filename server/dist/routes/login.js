"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.post("/login", (req, res) => {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(200).json({
            status: "failed",
            message: "Please Enter a valid username and password"
        });
        return;
    }
    if (req.body.username !== process.env.ac_USERNAME || req.body.password !== process.env.ac_PASSWORD) {
        res.status(200).json({
            status: "failed",
            message: "Incorrect Username or Password"
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        logged_in: true,
    }, process.env.SECRET);
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30 * 24 * 3600000)
    });
    res.status(200).json({
        status: "Success",
        message: "Logging you in..."
    });
});
exports.default = router;
