import path from 'path';
import fs from 'fs';

let settings = require("../../data/settings.json");

function updatSettings() {
    fs.writeFileSync(path.join(__dirname, "../../data/settings.json"), JSON.stringify(settings));
}

export function getSettings(settings_name: string): any {
    return settings[settings_name];
}

export function setSettings(settings_name: string, value: any): boolean {
    if (settings[settings_name]) {
        settings[settings_name] = value;
        updatSettings();
        return true;
    }
    return false;
}