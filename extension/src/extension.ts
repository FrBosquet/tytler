import { exec } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('"tytler" extension is now active!');

	const workspaceFolders = vscode.workspace.workspaceFolders;

	const getConfigFilePath = () => {
		if (!workspaceFolders) { throw new Error('No workspace folder is open.'); }

		return path.join(workspaceFolders[0].uri.fsPath, 'tytler.config.json');
	};

	const getConfig = () => {
		return JSON.parse(readFileSync(getConfigFilePath(), 'utf8'));
	};


	const checkAvailability = async () => {
		try {
			await new Promise((resolve, reject) => {
				exec('tytler', (error, stdout) => {
					if (error) {
						reject(error);
					}

					resolve(stdout);
				});
			});
		} catch (error) {
			vscode.window.showErrorMessage(`Tytler is not found`);
			return;
		}


		if (!existsSync(getConfigFilePath())) {
			vscode.window.showErrorMessage('Tytler: Config file not found. Use tytler init to create a config file.');
			return;
		}
	};

	const disposable = vscode.commands.registerCommand('tytler.replace-with-translation', async () => {
		if (workspaceFolders) {
			await checkAvailability();

			const config = getConfig();

			vscode.window.showInformationMessage(JSON.stringify(config));
		} else {
			vscode.window.showErrorMessage('Tytler: No workspace folder is open.');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
