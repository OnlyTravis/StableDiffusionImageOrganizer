"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const App = (0, express_1.default)();
App.use(express_1.default.json());
App.use((0, cookie_parser_1.default)());
App.use(express_1.default.static(path_1.default.join(__dirname, '../build')));
App.get(["/", "/login"], (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../build/index.html"));
    return;
});
(0, routes_1.default)(App);
App.use("/folders", express_1.default.static(process.env.OUTPUT_PATH));
App.get("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../build/index.html"));
    return;
});
App.listen(process.env.PORT, () => {
    console.log(`Webserver is opened on port ${process.env.PORT}`);
});
