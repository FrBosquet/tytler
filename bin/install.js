"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alpalog_1 = require("alpalog");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function install() {
    alpalog_1.logger.info(`\n# Installing Tytler VS Code extension...`);
    const binPath = path_1.default.resolve(__dirname);
    const extensionPath = path_1.default.resolve(binPath, '../extension');
    const files = (0, fs_1.readdirSync)(extensionPath);
    const vsixFile = files.find(file => file.endsWith('.vsix'));
    if (!vsixFile) {
        alpalog_1.logger.error(`# No .vsix file found in ${extensionPath}`);
        process.exit(1);
    }
    const vsixFilePath = path_1.default.join(extensionPath, vsixFile);
    alpalog_1.logger.whisper(`\n# vsix file path: ${vsixFilePath}`);
    (0, child_process_1.exec)(`code --install-extension ${vsixFilePath}`, (error, stdout, stderr) => {
        if (error) {
            alpalog_1.logger.error(`/# Error installing extension: ${error.message}`);
            process.exit(1);
        }
        if (stderr) {
            alpalog_1.logger.error(`/# Error installing extension: ${stderr}`);
            process.exit(1);
        }
        alpalog_1.logger.success(`\n# Tytler vs code extension installed!`);
        process.exit(0);
    });
}
exports.default = install;
