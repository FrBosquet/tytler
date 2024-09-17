import { exec } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import * as vscode from 'vscode';
import { getReplacement } from './extension.lib';

export function activate(context: vscode.ExtensionContext) {
	console.log('"tytler" extension is now active!');

	const workspaceFolders = vscode.workspace.workspaceFolders;
	let previousKey: string = '';

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
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				vscode.window.showErrorMessage('Tytler: No active editor found.');
				return;
			}

			const cursorPosition = editor.selection.active;
			const line = editor.document.lineAt(cursorPosition.line);
			const contextText = line.text;
			const selectedText = editor.document.getText(editor.selection);

			console.log({
				contextText,
				selectedText
			});

			const translationKey = await vscode.window.showInputBox({
				placeHolder: 'Enter the translation key',
				value: previousKey ?? '',
				ignoreFocusOut: true,
				valueSelection: [previousKey.length, previousKey.length]
			});

			if (!translationKey) {
				vscode.window.showInformationMessage('Tytler: No translation key provided');
				return;
			}

			if (translationKey.includes('.')) {
				const keyParts = translationKey.split('.');
				keyParts.pop();
				previousKey = keyParts.join('.') + '.';
			}

			const replacement = getReplacement(translationKey, selectedText, contextText);

			await editor.edit(editBuilder => {
				const lineRange = line.range;
				const selectionRange = editor.selection;

				// Determine the wider range
				const start = lineRange.start.isBefore(selectionRange.start) ? lineRange.start : selectionRange.start;
				const end = lineRange.end.isAfter(selectionRange.end) ? lineRange.end : selectionRange.end;
				const widerRange = new vscode.Range(start, end);

				editBuilder.replace(widerRange, replacement);
			});

			vscode.window.showInformationMessage('Tytler: Text replaced with translation key. Run the script to update the JSON file.');
		} else {
			vscode.window.showErrorMessage('Tytler: No workspace folder is open.');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
