"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alpalog_1 = require("alpalog");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function install() {
    alpalog_1.logger.info(`/# Installing Tytler vs code extension...`);
    const binPath = path_1.default.resolve(__dirname);
    const extensionPath = path_1.default.resolve(binPath, '../extension');
    alpalog_1.logger.info(`/# extPath: ${extensionPath}`);
    (0, child_process_1.exec)('code --install-extension tytler.tytler', (error, stdout, stderr) => {
    });
    process.exit(0);
}
exports.default = install;
