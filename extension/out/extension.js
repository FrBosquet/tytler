"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('"tytler" extension is now active!');
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const getConfigFilePath = () => {
        if (!workspaceFolders) {
            throw new Error('No workspace folder is open.');
        }
        return path_1.default.join(workspaceFolders[0].uri.fsPath, 'tytler.config.json');
    };
    const getConfig = () => {
        return JSON.parse((0, fs_1.readFileSync)(getConfigFilePath(), 'utf8'));
    };
    const checkAvailability = async () => {
        try {
            await new Promise((resolve, reject) => {
                (0, child_process_1.exec)('tytler', (error, stdout) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(stdout);
                });
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Tytler is not found`);
            return;
        }
        if (!(0, fs_1.existsSync)(getConfigFilePath())) {
            vscode.window.showErrorMessage('Tytler: Config file not found. Use tytler init to create a config file.');
            return;
        }
    };
    const disposable = vscode.commands.registerCommand('tytler.replace-with-translation', async () => {
        if (workspaceFolders) {
            await checkAvailability();
            const config = getConfig();
            vscode.window.showInformationMessage(JSON.stringify(config));
        }
        else {
            vscode.window.showErrorMessage('Tytler: No workspace folder is open.');
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map