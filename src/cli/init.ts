import { logger } from "alpalog";

import { existsSync, writeFileSync } from "fs";
import path from "path";
import config from "./config.json";
import { askQuestion } from "./lib";

async function init() {
  const newConfig = { ...config };

  logger.info(`\n# Initializing...`);

  // check if a config file already exists in tytler.config.json
  const currentDir = process.cwd();
  const configPath = path.join(currentDir, 'tytler.config.json');
  // read the file in config path

  if (existsSync(configPath)) {
    logger.error(`\n# A config file already exists in the current directory!`);
    logger.whisper(`# Do you want to overwrite it? (y/n)`);
    const overwrite = await askQuestion(`(y/n): `);

    if (overwrite !== 'y') {
      logger.info(`# Exiting...`);
      process.exit(0);
    }
  }

  logger.info(`\n# Answer the following questions to create a config file:\n`);

  // langs
  let rawLangs = await askQuestion(`Which languages do you want to use? default: 'en' (comma separated, two letter codes)(enter to use default): `);

  const langs = rawLangs.length
    ? rawLangs.split(',').map((code: string) => code.trim())
    : config.langs;

  newConfig.langs = langs;

  // defaultLang
  let defaultLang = langs[0];
  let rawDefaultLang = await askQuestion(`Which language do you want to use as the default? default: '${defaultLang}' (two letter code)(enter to use default): `);

  if (rawDefaultLang.length && !langs.includes(rawDefaultLang)) {
    logger.error(`Invalid default language! Please choose one of the languages you selected.`);
    process.exit(1);
  }

  defaultLang = rawDefaultLang.length ? rawDefaultLang : defaultLang;

  newConfig.defaultLang = defaultLang;

  // dir
  let rawDir = await askQuestion(`Where are your language files located? default: './lang' (enter to use default): `);

  const dir = rawDir.length ? rawDir : config.langDir;
  newConfig.langDir = dir;


  logger.whisper(`Creating a config file in the current directory...`);

  writeFileSync(configPath, JSON.stringify(newConfig, null, 2));

  logger.info(`\n# Done!`);
  process.exit(0);
}

export default init;