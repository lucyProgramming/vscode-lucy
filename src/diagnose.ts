/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
 'use strict';
 // The module 'vscode' contains the VS Code extensibility API
 // Import the module and reference it with the alias vscode in your code below
 import * as vscode from 'vscode';

const querystring = require('querystring');
const request = require('request');

var lastTime = new Date().getTime();

module.exports = function updateDiagnostics(
    document: vscode.TextDocument ,
    collection: vscode.DiagnosticCollection ,
    isSaveOrOpen : boolean) : void {
    if (document.isUntitled) {
        return;  
    }
    if (document.languageId !== "lucy") {
        return;
    }
    if(isSaveOrOpen === false){
        var now = new Date().getTime();
        if ((now - lastTime) < 1000) {
            return ;
        }
        lastTime = now ; 
    }
    collection.clear();
    var u = "http://localhost:2018/ide/diagnose?file=" + querystring.escape(document.fileName);
    console.log("!!!!!!!!!!!!!" , u);
    request({
        url: u ,
        method : "POST",
        body : document.getText(),
    } , function(error : any, response : any, body:any){
        if(error) {
            console.log(error);
            return ; 
        }
        var errs = JSON.parse(body);
        if(!errs) {
            return ; 
        }
        console.log(errs);
        for(let filename in errs) {
            console.log(filename , errs[filename]);
            var d = new Array();
            for(var i = 0 ; i < errs[filename].length ; i++) {
                var v = errs[filename][i];
                var t = new vscode.Diagnostic(
                    new vscode.Range(
                        new vscode.Position(v.pos.startLine , v.pos.startColumnOffset),
                        new vscode.Position(v.pos.startLine , v.pos.startColumnOffset)
                    ),
                    v.err
                );
                d.push(t);
            }
            collection.set(vscode.Uri.file(filename), d);
        }
    });
};