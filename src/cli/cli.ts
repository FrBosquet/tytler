#!/usr/bin/env node

import { logger } from "alpalog";
import config from "./config";
import init from "./init";
import install from "./install";
import { getArg, getPackageJson } from "./lib";
import scan from "./scan";
import settings from "./settings";
import sync from "./sync";

const command = getArg(0);

async function main() {
  if (!command) {
    const pkjson = getPackageJson();

    logger.info(`\n# Hello from Tytler!`);
    logger.warn(`version: ${pkjson.version}`);
    logger.whisper(`\n# Usage: tytler <command>`);
    logger.whisper(`\n# Commands:`);
    logger.whisper(`- init: Create a config file in the current directory`);
    logger.whisper(`- config: Show the config for the current repo`);
    logger.whisper(`- settings: Show the global tytler settings`);
    logger.whisper(`- install: Install the Tytler VS Code extension`);
    logger.whisper(`- scan: Scan the current directory to parse Tytler translation and fill the default lang file`);
    logger.whisper(`- sync: Sync the translations using OpenAI to translate missing keys`);

    process.exit(0);
  } else if (command === 'init') {
    init();
  } else if (command === 'config') {
    config();
  } else if (command === 'settings') {
    settings();
  } else if (command === 'install') {
    install();
  } else if (command === 'scan') {
    scan();
  } else if (command === 'sync') {
    sync();
  } else {
    logger.error(`# Command not found: ${command}`);
  }
  process.exit(1);
}

main();