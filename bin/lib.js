"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestion = void 0;
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const askQuestion = (question) => {
    return new Promise(resolve => rl.question(`\x1b[90m${question}\x1b[0m`, answer => resolve(answer)));
};
exports.askQuestion = askQuestion;
