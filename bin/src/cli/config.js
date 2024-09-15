"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alpalog_1 = require("alpalog");
const lib_1 = require("./lib");
function config() {
    alpalog_1.logger.info(`# Tytler config: \n\n`);
    const config = (0, lib_1.getConfig)();
    alpalog_1.logger.json(config);
    process.exit(0);
}
exports.default = config;
