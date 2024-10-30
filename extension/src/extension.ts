import { exec } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import * as vscode from 'vscode';
import { getReplacement } from './extension.lib';

export function activate(context: vscode.ExtensionContext) {
	console.log('"tytler" extension is now active!');

	const workspaceFolders = vscode.workspace.workspaceFolders;
	let previousKey: string = '';

	const getWorkspaceFolder = () => {
		if (!workspaceFolders) { throw new Error('No workspace folder is open.'); }
		return workspaceFolders[0].uri.fsPath;
	};

	const getConfigFilePath = () => {
		const workspaceFolder = getWorkspaceFolder();

		return path.join(workspaceFolder, 'tytler.config.json');
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

	const replaceWithTranslation = async (editor: vscode.TextEditor) => {
		const cursorPosition = editor.selection.active;
		const line = editor.document.lineAt(cursorPosition.line);
		const contextText = line.text;
		const selectedText = editor.document.getText(editor.selection);

		// For debugging purposes
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

		await vscode.commands.executeCommand('workbench.action.files.saveWithoutFormatting');
	};

	const tytlerScan = async () => {
		await new Promise((resolve, reject) => {
			exec(`tytler scan`, { cwd: getWorkspaceFolder() }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Tytler CLI error: ${error.message}`);
					reject(error);
				}
				if (stderr) {
					vscode.window.showErrorMessage(`Tytler CLI error: ${stderr}`);
					resolve(stderr);
				}
				resolve(stdout);
			});
		});
	};

	const tytlerSync = async () => {
		await new Promise((resolve, reject) => {
			exec(`tytler sync`, { cwd: getWorkspaceFolder() }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Tytler CLI error: ${error.message}`);
					reject(error);
				}
				if (stderr) {
					vscode.window.showErrorMessage(`Tytler CLI error: ${stderr}`);
					resolve(stderr);
				}
				resolve(stdout);
			});
		});
	};

	const disposableReplace = vscode.commands.registerCommand('tytler.replace-with-translation', async () => {
		if (workspaceFolders) {
			await checkAvailability();
			const config = getConfig();
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				vscode.window.showErrorMessage('Tytler: No active editor found.');
				return;
			}

			await replaceWithTranslation(editor);

			await tytlerScan();
			vscode.window.showInformationMessage('Tytler: Text replaced with translation key.');

			await vscode.commands.executeCommand('editor.action.formatDocument');
			await vscode.commands.executeCommand('workbench.action.files.save');
		} else {
			vscode.window.showErrorMessage('Tytler: No workspace folder is open.');
		}
	});

	const disposableReplaceAndSync = vscode.commands.registerCommand('tytler.replace-and-sync', async () => {
		if (workspaceFolders) {
			await checkAvailability();
			const config = getConfig();
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				vscode.window.showErrorMessage('Tytler: No active editor found.');
				return;
			}

			await replaceWithTranslation(editor);

			await tytlerScan();
			vscode.window.showInformationMessage('Tytler: Text replaced with translation key.');

			await tytlerSync();
			vscode.window.showInformationMessage('Tytler: Translations synced with OpenAI.');

			await vscode.commands.executeCommand('editor.action.formatDocument');
			await vscode.commands.executeCommand('workbench.action.files.save');
		} else {
			vscode.window.showErrorMessage('Tytler: No workspace folder is open.');
		}
	});

	const disposableSync = vscode.commands.registerCommand('tytler.sync', async () => {
		await checkAvailability();
		await tytlerSync();
		vscode.window.showInformationMessage('Tytler: Translations synced using OpenAI.');
	});

	const disposableAddTranslation = vscode.commands.registerCommand('tytler.add-translation', async () => {
		if (workspaceFolders) {
			await checkAvailability();

			const translationKey = await vscode.window.showInputBox({
				placeHolder: 'Enter the translation key',
				value: previousKey ?? '',
				ignoreFocusOut: true,
				valueSelection: [previousKey.length, previousKey.length]
			});

			const translationValue = await vscode.window.showInputBox({
				placeHolder: 'Enter the translation value',
				ignoreFocusOut: true
			});

			await new Promise((resolve, reject) => {
				exec(`tytler add "${translationKey}" "${translationValue}"`, { cwd: getWorkspaceFolder() }, (error, stdout, stderr) => {
					if (error) {
						vscode.window.showErrorMessage(`Tytler CLI error: ${error.message}`);
						reject(error);
					}
					if (stderr) {
						vscode.window.showErrorMessage(`Tytler CLI error: ${stderr}`);
						resolve(stderr);
					}
					resolve(stdout);
				});
			});

			vscode.window.showInformationMessage('Tytler: Translation added.');
		} else {
			vscode.window.showErrorMessage('Tytler: No workspace folder is open.');
		}
	});

	context.subscriptions.push(disposableReplace);
	context.subscriptions.push(disposableReplaceAndSync);
	context.subscriptions.push(disposableSync);
	context.subscriptions.push(disposableAddTranslation);
}

export function deactivate() { }
