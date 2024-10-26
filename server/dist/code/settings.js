"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.setSettings = setSettings;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let settings = require("../../data/settings.json");
function updatSettings() {
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "../../data/settings.json"), JSON.stringify(settings));
}
function getSettings(settings_name) {
    return settings[settings_name];
}
function setSettings(settings_name, value) {
    if (settings[settings_name]) {
        settings[settings_name] = value;
        updatSettings();
        return true;
    }
    return false;
}
