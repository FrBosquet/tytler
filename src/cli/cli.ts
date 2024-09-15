#!/usr/bin/env node

import { logger } from "alpalog";
import config from "./config";
import init from "./init";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command) {
    logger.info(`# Hello from Tytler! ${args}`);
    logger.whisper(`\n# Usage: tytler <command>`);
    logger.whisper(`\n# Commands:`);
    logger.whisper(`- init: Create a config file in the current directory`);
    logger.whisper(`- config: Show the current config`);
  } else if (command === 'init') {
    init();
  } else if (command === 'config') {
    config();
  }
}

main();