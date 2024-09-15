"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.askQuestion = void 0;
const alpalog_1 = require("alpalog");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const askQuestion = (question) => {
    return new Promise(resolve => rl.question(`\x1b[90m${question}\x1b[0m`, answer => resolve(answer)));
};
exports.askQuestion = askQuestion;
const getConfig = () => {
    // check if a config file already exists in tytler.config.json
    const currentDir = process.cwd();
    const configPath = path_1.default.join(currentDir, 'tytler.config.json');
    // read the file in config path
    const file = (0, fs_1.readFileSync)(configPath, 'utf-8');
    if (!file) {
        alpalog_1.logger.error(`\n# No config file found!`);
        alpalog_1.logger.whisper(`# Run 'tytler init' to create a config file.`);
        process.exit(1);
    }
    return JSON.parse(file);
};
exports.getConfig = getConfig;
