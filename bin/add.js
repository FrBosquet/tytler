"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alpalog_1 = require("alpalog");
const path_1 = __importDefault(require("path"));
const lib_1 = require("./lib");
async function add() {
    const key = process.argv[3];
    const value = process.argv[4];
    alpalog_1.logger.info(`\n# Adding a new key: ${key}`);
    alpalog_1.logger.info(`# With value: ${value}`);
    if (!key || !value) {
        alpalog_1.logger.error(`\n# Please provide a key as first argument and a value as the second!`);
        process.exit(1);
    }
    alpalog_1.logger.info(`\n# Adding a new key`);
    const currentDir = process.cwd();
    const config = (0, lib_1.getConfig)();
    alpalog_1.logger.whisper('Loading default lang...');
    const langDirPathname = path_1.default.join(currentDir, config.langDir);
    const defaultLangPathname = path_1.default.join(langDirPathname, `${config.defaultLang}.json`);
    const defaultLang = (0, lib_1.readJsonFile)(defaultLangPathname);
    alpalog_1.logger.whisper('Default lang loaded!');
    const langs = config.langs.filter((lang) => lang !== config.defaultLang);
}
exports.default = add;