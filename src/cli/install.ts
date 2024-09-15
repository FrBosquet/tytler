import { logger } from "alpalog";
import { exec } from "child_process";
import { readdirSync } from "fs";
import path from "path";

function install() {
  logger.info(`\n# Installing Tytler VS Code extension...`);

  const binPath = path.resolve(__dirname)
  const extensionPath = path.resolve(binPath, '../extension');


  const files = readdirSync(extensionPath);
  const vsixFile = files.find(file => file.endsWith('.vsix'));

  if (!vsixFile) {
    logger.error(`# No .vsix file found in ${extensionPath}`);
    process.exit(1);
  }

  const vsixFilePath = path.join(extensionPath, vsixFile);
  logger.whisper(`\n# vsix file path: ${vsixFilePath}`);

  exec(`code --install-extension ${vsixFilePath}`, (error, stdout, stderr) => {
    if (error) {
      logger.error(`/# Error installing extension: ${error.message}`);
      process.exit(1);
    }

    if (stderr) {
      logger.error(`/# Error installing extension: ${stderr}`);
      process.exit(1);
    }

    logger.success(`\n# Tytler vs code extension installed!`);
    process.exit(0);
  });
}

export default install;