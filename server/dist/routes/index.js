"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = __importDefault(require("./login"));
const auth_1 = __importDefault(require("./auth"));
const api_1 = __importDefault(require("./api"));
const mountRouters = (app) => {
    app.use(login_1.default);
    app.use(auth_1.default);
    app.use(api_1.default);
};
exports.default = mountRouters;
