/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// const cp = require('child_process');

const GoDefinitionProvider = require("./goto_definition");
const GoReferenceProvider = require("./findusage");
const GoWorkSpaceSymbolProvider = require("./dir_definitions");
const GoCompletionItemProvider = require("./auto_completion");
const GoDocumentSymbolProvider = require("./outline");
const GoHoverProvider = require("./hovers");
const updateDiagnostics = require('./diagnose');
const GoDocumentFormatter = require("./fmt");
const GoRenameProvider = require("./rename");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let lucySelector: vscode.DocumentSelector = { scheme: 'file', language: 'lucy' };

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "lucy" is now active!');
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            lucySelector, new GoDefinitionProvider()));
    context.subscriptions.push(
        vscode.languages.registerReferenceProvider(
            lucySelector, new GoReferenceProvider()));
    context.subscriptions.push(
        vscode.languages.registerWorkspaceSymbolProvider(
            new GoWorkSpaceSymbolProvider()));
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            lucySelector, new GoCompletionItemProvider(), '.', '\"'));
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            lucySelector, new GoDocumentSymbolProvider()));
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            lucySelector, new GoHoverProvider()));
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            lucySelector, new GoDocumentFormatter()));
    context.subscriptions.push(
        vscode.languages.registerRenameProvider(
            lucySelector, new GoRenameProvider()));
    const collection = vscode.languages.createDiagnosticCollection('lucy');
    context.subscriptions.push(collection);
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(e => updateDiagnostics(e, collection, true)));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(e => updateDiagnostics(e, collection, true)));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => updateDiagnostics(e.document, collection, false)));
}






// this method is called when your extension is deactivated
export function deactivate() {

}