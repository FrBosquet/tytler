
import { logger } from "alpalog";
import { readFileSync } from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const askQuestion = (question: string): Promise<string> => {
  return new Promise(resolve => rl.question(`\x1b[90m${question}\x1b[0m`, answer => resolve(answer)));
};

export const getConfig = () => {
  // check if a config file already exists in tytler.config.json
  const currentDir = process.cwd();
  const configPath = path.join(currentDir, 'tytler.config.json');
  // read the file in config path

  const file = readFileSync(configPath, 'utf-8');

  if (!file) {
    logger.error(`\n# No config file found!`);
    logger.whisper(`# Run 'tytler init' to create a config file.`);
    process.exit(1);
  }

  return JSON.parse(file);
}