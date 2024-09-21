import { logger } from "alpalog";
import { getConfig } from "./lib";

function config() {
  logger.info(`\n# Tytler repo config:\n`);
  const config = getConfig();
  logger.info('');
  logger.json(config);
  process.exit(0);
}

export default config;