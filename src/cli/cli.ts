#!/usr/bin/env node

import { logger } from "alpalog";
import { exit } from "process";
import init from "./init";
import { getConfig } from "./lib";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command) {
    logger.info(`# Hello from Tytler! ${args}`);
    logger.whisper(`\n# Usage: tytler <command>`);
    logger.whisper(`\n# Commands:`);
    logger.whisper(`- init: Create a config file in the current directory`);
  } else if (command === 'init') {
    init();
  } else if (command === 'config') {
    logger.info(`# Tytler config: \n\n`);
    const config = getConfig();
    logger.json(config);
    exit(0);
  }
}

main();