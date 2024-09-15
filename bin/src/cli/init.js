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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const config_json_1 = __importDefault(require("./config.json"));
const lib_1 = require("./lib");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const newConfig = Object.assign({}, config_json_1.default);
        alpalog_1.logger.info(`\n# Initializing...`);
        // check if a config file already exists in tytler.config.json
        const currentDir = process.cwd();
        const configPath = path_1.default.join(currentDir, 'tytler.config.json');
        // read the file in config path
        if ((0, fs_1.existsSync)(configPath)) {
            alpalog_1.logger.error(`\n# A config file already exists in the current directory!`);
            alpalog_1.logger.whisper(`# Do you want to overwrite it? (y/n)`);
            const overwrite = yield (0, lib_1.askQuestion)(`(y/n): `);
            if (overwrite !== 'y') {
                alpalog_1.logger.info(`# Exiting...`);
                process.exit(0);
            }
        }
        alpalog_1.logger.info(`\n# Answer the following questions to create a config file:\n`);
        // langs
        let rawLangs = yield (0, lib_1.askQuestion)(`Which languages do you want to use? default: 'en' (comma separated, two letter codes)(enter to use default): `);
        const langs = rawLangs.length
            ? rawLangs.split(',').map((code) => code.trim())
            : config_json_1.default.langs;
        newConfig.langs = langs;
        // defaultLang
        let defaultLang = langs[0];
        let rawDefaultLang = yield (0, lib_1.askQuestion)(`Which language do you want to use as the default? default: '${defaultLang}' (two letter code)(enter to use default): `);
        if (rawDefaultLang.length && !langs.includes(rawDefaultLang)) {
            alpalog_1.logger.error(`Invalid default language! Please choose one of the languages you selected.`);
            process.exit(1);
        }
        defaultLang = rawDefaultLang.length ? rawDefaultLang : defaultLang;
        newConfig.defaultLang = defaultLang;
        // dir
        let rawDir = yield (0, lib_1.askQuestion)(`Where are your language files located? default: './lang' (enter to use default): `);
        const dir = rawDir.length ? rawDir : config_json_1.default.langDir;
        newConfig.langDir = dir;
        alpalog_1.logger.whisper(`Creating a config file in the current directory...`);
        (0, fs_1.writeFileSync)(configPath, JSON.stringify(newConfig, null, 2));
        alpalog_1.logger.info(`\n# Done!`);
        process.exit(0);
    });
}
exports.default = init;
