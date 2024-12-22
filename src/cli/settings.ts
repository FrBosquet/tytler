import { logger } from "alpalog";
import { getArg, getCliConfig, getCliConfigs, setCliConfig } from "./lib";


function settings() {
  const op = getArg(1);

  logger.info(`\n# Tytler global settings:\n`);

  if (op === 'get') {
    const key = getArg(2);

    if (key == undefined) {
      logger.error(`\n# Provide the key you want the value for`);
      process.exit(1)
    } else {
      const config = getCliConfig(key);

      if (config == undefined) {
        logger.error(`\n# Key not found: ${key}`);
        process.exit(1);
      } else {
        logger.info(`\n# ${key}: ${config}`);
        process.exit(0);
      }

    }
  } else if (op === 'set') {
    const key = getArg(2);
    const value = getArg(3);

    if (key == undefined || value == undefined) {
      logger.error(`\n# Provide the key and value you want to set`);
      process.exit(1)
    } else {
      setCliConfig(key, value);
      logger.info(`\n# ${key} set to ${value}`);
      process.exit(0);
    }
  } else if (op == undefined) {
    const config = getCliConfigs();
    logger.info('');
    logger.json(config);
    process.exit(0);

  } else {
    logger.error(`\n# Operation not found: ${op}`);
    process.exit(1);
  }
}

export default settings;