import { logger } from "alpalog";
import { getConfig } from "./lib";

function config() {
  logger.info(`# Tytler config: \n\n`);
  const config = getConfig();
  logger.json(config);
  process.exit(0);
}

export default config;