

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const querystring = require('querystring');
const request = require('request');

module.exports = class GoRenameProvider implements vscode.RenameProvider {
    public provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string, token: vscode.CancellationToken):
        Thenable<vscode.WorkspaceEdit> {
        return new Promise(function (resolve, reject) {
            var u = "http://localhost:2018/ide/rename?filename=" + querystring.escape(document.fileName) +
                "&line=" + position.line + "&column=" + position.character + "&to=" + newName;
            console.log(u);
            request({
                "url": u,
                "body": document.getText(),
            }, function (error: any, response: any, body: any) {
                if (error) {
                    console.log(error);
                    reject(error);
                    return;
                }
                if (response.statusCode !== 200) {
                    console.log(response.body);
                    reject(response.body);
                    return;
                }
                resolve(undefined);
            });
        });
    }
}

