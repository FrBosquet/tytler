"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToCamelCase = exports.getPackageJson = exports.writeJsonFile = exports.readJsonFile = exports.sortObjectKeys = exports.getConfig = exports.askQuestion = void 0;
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
    try {
        const file = (0, fs_1.readFileSync)(configPath, 'utf-8');
        alpalog_1.logger.whisper('Config loaded!');
        return JSON.parse(file);
    }
    catch (e) {
        alpalog_1.logger.error(`\n# No config file found!`);
        alpalog_1.logger.whisper(`# Run 'tytler init' to create a config file.`);
        process.exit(1);
    }
};
exports.getConfig = getConfig;
const sortObjectKeys = (obj) => {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
};
exports.sortObjectKeys = sortObjectKeys;
const readJsonFile = (filePath) => {
    return JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
};
exports.readJsonFile = readJsonFile;
const writeJsonFile = (pathName, obj) => {
    (0, fs_1.writeFileSync)(pathName, JSON.stringify((0, exports.sortObjectKeys)(obj), null, 2));
};
exports.writeJsonFile = writeJsonFile;
const getPackageJson = () => {
    const packageJsonPath = path_1.default.join(__dirname, 'package.json');
    return (0, exports.readJsonFile)(packageJsonPath);
};
exports.getPackageJson = getPackageJson;
const convertToCamelCase = (input) => {
    const parts = input.split('.');
    const [firstPart, secondPart] = parts;
    const capitalizedSecondPart = secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
    return firstPart + capitalizedSecondPart;
};
exports.convertToCamelCase = convertToCamelCase;
