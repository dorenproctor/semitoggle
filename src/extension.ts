import * as vscode from 'vscode';
import { injectSemicolons, removeSemicolons } from './semicolonLogic';

function alterText(fn: Function) {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		const fileContent = editor.document.getText();
		const alteredContent = fn(fileContent);
		const firstLine = editor.document.lineAt(0);
		const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
		const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
		editor.edit(editBuilder => editBuilder.replace(textRange, alteredContent));
	} else {
		vscode.window.showInformationMessage('Failed to access current page');
	}
}

export function activate(context: vscode.ExtensionContext) {
	let addCommand = vscode.commands.registerCommand('extension.addSemicolons', () => {
		alterText(injectSemicolons);
	});
	const removeCommand = vscode.commands.registerCommand('extension.removeSemicolons', () => {
		alterText(removeSemicolons);
	});
	context.subscriptions.push(addCommand, removeCommand);
}

export function deactivate() {}
