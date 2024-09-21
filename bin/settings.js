"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alpalog_1 = require("alpalog");
const lib_1 = require("./lib");
function settings() {
    const op = (0, lib_1.getArg)(1);
    alpalog_1.logger.info(`\n# Tytler global settings:\n`);
    if (op === 'get') {
        const key = (0, lib_1.getArg)(2);
        if (key == undefined) {
            alpalog_1.logger.error(`\n# Provide the key you want the value for`);
            process.exit(1);
        }
        else {
            const config = (0, lib_1.getCliConfig)(key);
            if (config == undefined) {
                alpalog_1.logger.error(`\n# Key not found: ${key}`);
                process.exit(1);
            }
            else {
                alpalog_1.logger.info(`\n# ${key}: ${config}`);
                process.exit(0);
            }
        }
    }
    else if (op === 'set') {
        const key = (0, lib_1.getArg)(2);
        const value = (0, lib_1.getArg)(3);
        if (key == undefined || value == undefined) {
            alpalog_1.logger.error(`\n# Provide the key and value you want to set`);
            process.exit(1);
        }
        else {
            (0, lib_1.setCliConfig)(key, value);
            alpalog_1.logger.info(`\n# ${key} set to ${value}`);
            process.exit(0);
        }
    }
    else if (op == undefined) {
        const config = (0, lib_1.getCliConfigs)();
        alpalog_1.logger.info('');
        alpalog_1.logger.json(config);
        process.exit(0);
    }
    else {
        alpalog_1.logger.error(`\n# Operation not found: ${op}`);
        process.exit(1);
    }
}
exports.default = settings;
