
import { logger } from "alpalog";
import { readFileSync, writeFileSync } from "fs";
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

  try {
    const file = readFileSync(configPath, 'utf-8');

    logger.whisper('Config loaded!');

    return JSON.parse(file) as {
      langs: string[];
      defaultLang: string;
      langDir: string;
      targetDir: string;
    };
  } catch (e) {
    logger.error(`\n# No config file found!`);
    logger.whisper(`# Run 'tytler init' to create a config file.`);
    process.exit(1);
  }
}

export const sortObjectKeys = (
  obj: Record<string, any>
): Record<string, any> => {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, any>, key: string) => {
      result[key] = obj[key]
      return result
    }, {})
}

export const readJsonFile = <T>(filePath: string): T => {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

export const writeJsonFile = (pathName: string, obj: Record<string, any>): void => {
  writeFileSync(pathName, JSON.stringify(sortObjectKeys(obj), null, 2))
}

export const getPackageJson = () => {
  const packageJsonPath = path.join(__dirname, 'package.json');
  return readJsonFile<{ version: string }>(packageJsonPath);
}

export const convertToCamelCase = (input: string): string => {
  const parts = input.split('.');
  const [firstPart, secondPart] = parts;
  const capitalizedSecondPart = secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
  return firstPart + capitalizedSecondPart;
}