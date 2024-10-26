"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = __importDefault(require("./login"));
const auth_1 = __importDefault(require("./auth"));
const api_folders_1 = __importDefault(require("./api_folders"));
const api_images_1 = __importDefault(require("./api_images"));
const mountRouters = (app) => {
    app.use(login_1.default);
    app.use(auth_1.default);
    app.use(api_folders_1.default);
    app.use(api_images_1.default);
};
exports.default = mountRouters;
