#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alpalog_1 = require("alpalog");
const config_1 = __importDefault(require("./config"));
const init_1 = __importDefault(require("./init"));
const install_1 = __importDefault(require("./install"));
const lib_1 = require("./lib");
const scan_1 = __importDefault(require("./scan"));
const settings_1 = __importDefault(require("./settings"));
const sync_1 = __importDefault(require("./sync"));
const command = (0, lib_1.getArg)(0);
async function main() {
    if (!command) {
        const pkjson = (0, lib_1.getPackageJson)();
        alpalog_1.logger.info(`\n# Hello from Tytler!`);
        alpalog_1.logger.warn(`version: ${pkjson.version}`);
        alpalog_1.logger.whisper(`\n# Usage: tytler <command>`);
        alpalog_1.logger.whisper(`\n# Commands:`);
        alpalog_1.logger.whisper(`- init: Create a config file in the current directory`);
        alpalog_1.logger.whisper(`- config: Show the config for the current repo`);
        alpalog_1.logger.whisper(`- settings: Show the global tytler settings`);
        alpalog_1.logger.whisper(`- install: Install the Tytler VS Code extension`);
        alpalog_1.logger.whisper(`- scan: Scan the current directory to parse Tytler translation and fill the default lang file`);
        alpalog_1.logger.whisper(`- sync: Sync the translations using OpenAI to translate missing keys`);
    }
    else if (command === 'init') {
        await (0, init_1.default)();
    }
    else if (command === 'config') {
        await (0, config_1.default)();
    }
    else if (command === 'settings') {
        await (0, settings_1.default)();
    }
    else if (command === 'install') {
        await (0, install_1.default)();
    }
    else if (command === 'scan') {
        await (0, scan_1.default)();
    }
    else if (command === 'sync') {
        await (0, sync_1.default)();
    }
    else {
        alpalog_1.logger.error(`# Command not found: ${command}`);
        process.exit(1);
    }
    process.exit(0);
}
main();
