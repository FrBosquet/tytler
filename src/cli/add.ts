import { logger } from "alpalog";
import path from "path";
import { getConfig, readJsonFile, sortObjectKeys, writeJsonFile } from "./lib";

async function add() {
  const key = process.argv[3];
  const value = process.argv[4];

  if (!key || !value) {
    logger.error(`\n# Please provide a key as first argument and a value as the second!`);
    process.exit(1);
  }

  logger.info(`\n# Adding a new key: ${key}`);
  logger.info(`# With value: ${value}`);

  logger.info(`\n# Adding a new key`);

  const currentDir = process.cwd()
  const config = getConfig();

  logger.whisper('Loading default lang...')

  const langDirPathname = path.join(currentDir, config.langDir)
  const defaultLangPathname = path.join(
    langDirPathname,
    `${config.defaultLang}.json`
  )

  const defaultLang = readJsonFile<Record<string, string>>(defaultLangPathname)

  logger.whisper('Default lang loaded!')

  logger.info(`\n# Adding key to default lang...`)
  writeJsonFile(defaultLangPathname, sortObjectKeys(defaultLang))

  logger.success(`Successfully added key to default lang!`)
  logger.info(`\n# You can run 'tytler sync' to sync the key to other languages.`)
}

export default add