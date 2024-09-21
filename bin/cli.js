#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const args = process.argv.slice(2);
const command = args[0];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!command) {
            const pkjson = (0, lib_1.getPackageJson)();
            alpalog_1.logger.info(`\n# Hello from Tytler! ${args}`);
            alpalog_1.logger.warn(`version: ${pkjson.version}`);
            alpalog_1.logger.whisper(`\n# Usage: tytler <command>`);
            alpalog_1.logger.whisper(`\n# Commands:`);
            alpalog_1.logger.whisper(`- init: Create a config file in the current directory`);
            alpalog_1.logger.whisper(`- config: Show the current config`);
            alpalog_1.logger.whisper(`- install: Install the Tytler VS Code extension`);
            alpalog_1.logger.whisper(`- scan: Scan the current directory to parse Tytler translation and fill the default lang file`);
            process.exit(0);
        }
        else if (command === 'init') {
            (0, init_1.default)();
        }
        else if (command === 'config') {
            (0, config_1.default)();
        }
        else if (command === 'install') {
            (0, install_1.default)();
        }
        else if (command === 'scan') {
            (0, scan_1.default)();
        }
        else {
            alpalog_1.logger.error(`# Command not found: ${command}`);
            process.exit(1);
        }
    });
}
main();
