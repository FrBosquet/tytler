
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const askQuestion = (question: string): Promise<string> => {
  return new Promise(resolve => rl.question(`\x1b[90m${question}\x1b[0m`, answer => resolve(answer)));
};