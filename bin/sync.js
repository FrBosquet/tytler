"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const path_1 = __importDefault(require("path"));
const alpalog_1 = require("alpalog");
const lib_1 = require("./lib");
async function sync() {
    let openai;
    try {
        openai = new openai_1.default({ apiKey: (0, lib_1.getCliConfig)('openai') });
    }
    catch (e) {
        alpalog_1.logger.error(`OpenAI API Key not found. Please set it using 'tytler settings set openai <api-key>'`);
        process.exit(1);
    }
    await new Promise((resolve) => setTimeout(() => {
        console.log('Test');
        resolve(void 0);
    }, 1000));
    alpalog_1.logger.info(`\n# Scanning default lang for keys...`);
    const currentDir = process.cwd();
    const config = (0, lib_1.getConfig)();
    alpalog_1.logger.whisper('Loading default lang...');
    const langDirPathname = path_1.default.join(currentDir, config.langDir);
    const defaultLangPathname = path_1.default.join(langDirPathname, `${config.defaultLang}.json`);
    const defaultLang = (0, lib_1.readJsonFile)(defaultLangPathname);
    alpalog_1.logger.whisper('Default lang loaded!');
    const langs = config.langs.filter((lang) => lang !== config.defaultLang);
    let promptTokens = 0;
    let completionTokens = 0;
    for (const langKey of langs) {
        alpalog_1.logger.info(`\n> Checking \x1b[33m${langKey}\x1b[0m...`);
        const langPathname = path_1.default.join(langDirPathname, `${langKey}.json`);
        let langFile;
        try {
            langFile = (0, lib_1.readJsonFile)(langPathname);
        }
        catch (e) {
            alpalog_1.logger.error(`Error reading ${langKey}.json, or file does not exist. Defaulting to empty object.`);
            langFile = {};
        }
        let missingKeys = {};
        for (const key in defaultLang) {
            if (!langFile[key]) {
                alpalog_1.logger.whisper(`Adding missing key '${key}' to ${langKey}.json`);
                missingKeys[key] = defaultLang[key];
            }
        }
        const missingKeysCount = Object.keys(missingKeys).length;
        if (missingKeysCount > 0) {
            alpalog_1.logger.whisper(`${missingKeysCount} untranslated keys found`);
            alpalog_1.logger.whisper('Translating using gpt-4o-mini...');
            const result = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert translator. You are going to receive a JSON structure including keys and values in a source language that you can infer from these two letters: ${config.defaultLang}. Your task is to translate the values to another language that you should infer from these two letters: ${langKey}. The output should be a JSON object with the same keys and the translated values that can be parsed using JSON.parse.`
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(missingKeys)
                    }
                ]
            });
            promptTokens += result.usage?.prompt_tokens ?? 0;
            completionTokens += result.usage?.completion_tokens ?? 0;
            if (result.choices[0]) {
                try {
                    const missingTranslations = JSON.parse(result.choices[0].message.content);
                    const fileComplete = (0, lib_1.sortObjectKeys)({
                        ...langFile,
                        ...missingTranslations
                    });
                    (0, lib_1.writeJsonFile)(langPathname, fileComplete);
                    alpalog_1.logger.info(`File ${langKey}.json updated!`);
                }
                catch (e) {
                    alpalog_1.logger.error(`Error: ${e}`);
                    alpalog_1.logger.info(JSON.stringify(result, null, 2));
                }
            }
        }
        else {
            alpalog_1.logger.info(`No untranslated keys found for \x1b[33m${langKey}\x1b[0m`);
        }
    }
    alpalog_1.logger.info('\n\n> All languages processed!');
    alpalog_1.logger.whisper('Sorting default lang...');
    (0, lib_1.writeJsonFile)(defaultLangPathname, (0, lib_1.sortObjectKeys)(defaultLang));
    alpalog_1.logger.info('> Default lang sorted!');
    alpalog_1.logger.info('\n\n> Operation cost');
    const promptCost = (promptTokens * 15) / 1000000;
    alpalog_1.logger.whisper(`Prompt tokens: ${promptTokens}. (${promptCost.toFixed(4)}$ cents)`);
    const completionCost = (completionTokens * 60) / 1000000;
    alpalog_1.logger.whisper(`Completion tokens: ${completionTokens}. (${completionCost.toFixed(4)}$ cents)`);
    alpalog_1.logger.whisper(`Total cost: ${(promptCost + completionCost).toFixed(4)}$ cents`);
    alpalog_1.logger.success(`\n✅ All translations synced!`);
}
exports.default = sync;
