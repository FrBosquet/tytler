"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alpalog_1 = require("alpalog");
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const lib_1 = require("./lib");
async function scan() {
    alpalog_1.logger.info(`\n# Scanning all files for translations...`);
    const currentDir = process.cwd();
    const config = (0, lib_1.getConfig)();
    alpalog_1.logger.whisper('Loading default lang...');
    const langDirPathname = path_1.default.join(currentDir, config.langDir);
    const defaultLangPathname = path_1.default.join(langDirPathname, `${config.defaultLang}.json`);
    const defaultLang = (0, lib_1.readJsonFile)(defaultLangPathname);
    alpalog_1.logger.whisper('Default lang loaded!');
    const pattern = `"\\bt\\([\\'](.*?)[\\']\\)"`;
    let added = 0;
    const scanFolder = (folder) => {
        alpalog_1.logger.whisper(`Scanning ${folder}...`);
        const componentsDir = path_1.default.join(currentDir, folder);
        const command = `egrep -r ${pattern} ${componentsDir}`;
        // Look for the pattern t('*') in all files in the target dir
        const stdout = (0, lib_1.asyncExec)(command);
        const lines = stdout.split('\n');
        for (const line of lines) {
            const [file, text] = line.split(':');
            const match = text?.match(/t\('(.*?)\'\)/);
            if (!match)
                continue;
            let key = match[1], content = '';
            if (key in defaultLang) {
                continue;
            }
            added++;
            if (key.includes('->')) {
                let [newKey, newContent] = key.split('->');
                if (newKey in defaultLang) {
                    alpalog_1.logger.error(`Key ${newKey} already exists and trying rewrite. Check ${newKey} in ${file}`);
                    alpalog_1.logger.whisper('Using previous value...');
                    (0, lib_1.asyncExec)(`sed -i 's/${key}/${newKey}/g' ${file}`);
                    continue;
                }
                // Detect if content has any characters beetween curly braces, like {user.name}
                const hasCurlyBraces = newContent.match(/{.*?}/);
                if (hasCurlyBraces) {
                    const replacements = hasCurlyBraces.map(key => key.replace(/[{}]/g, ''));
                    alpalog_1.logger.whisper(replacements);
                    let valuesObj = '{';
                    replacements.forEach(replacement => {
                        const key = (0, lib_1.convertToCamelCase)(replacement);
                        valuesObj += ` ${key}: ${replacement}, `;
                        newContent = newContent.replace(`{${replacement}}`, `{{${key}}}`);
                    });
                    valuesObj += '}';
                    (0, lib_1.asyncExec)(`sed -i "s/${key}')/${newKey}',${valuesObj})/g" ${file}`);
                }
                else {
                    (0, lib_1.asyncExec)(`sed -i 's/${key}/${newKey}/g' ${file}`);
                }
                key = newKey;
                content = newContent;
            }
            defaultLang[key] = content;
        }
    };
    for (const folder of config.targetDir) {
        scanFolder(folder);
    }
    (0, lib_1.writeJsonFile)(defaultLangPathname, defaultLang);
    alpalog_1.logger.success(`\n✅ Added ${added} new keys to ${config.defaultLang}.json`);
    (0, process_1.exit)(0);
}
exports.default = scan;
