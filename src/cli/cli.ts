#!/usr/bin/env node

import { logger } from "alpalog";
import config from "./config";
import init from "./init";
import install from "./install";
import { getPackageJson } from "./lib";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command) {
    const pkjson = getPackageJson();

    logger.info(`\n# Hello from Tytler! ${args}`);
    logger.warn(`version: ${pkjson.version}`);
    logger.whisper(`\n# Usage: tytler <command>`);
    logger.whisper(`\n# Commands:`);
    logger.whisper(`- init: Create a config file in the current directory`);
    logger.whisper(`- config: Show the current config`);
    logger.whisper(`- install: Install the Tytler vs code extension`);

    process.exit(0);
  } else if (command === 'init') {
    init();
  } else if (command === 'config') {
    config();
  } else if (command === 'install') {
    install();
  } else {
    logger.error(`# Command not found: ${command}`);

    process.exit(1);
  }
}

main();