"use strict";

var ioProcess = require("../ioProcess");

var NAME = "windows";
var CMD_GET = "cscript", CMD_SET = "clip";
var CLIPBOARD_MAIN = "main";

/*===================================================== Exports  =====================================================*/

exports.name = NAME;
exports.clipboards = [CLIPBOARD_MAIN];
exports.isSupported = process.platform === "win32";

exports.read = read;
exports.write = write;

/*==================================================== Functions  ====================================================*/

function read(ignored, cb) { ioProcess.output(CMD_GET, ["/Nologo", __dirname + "\\fallbacks\\paste.vbs"], cb); }

function write(ignored, value, cb) { ioProcess.input(CMD_SET, [], value, cb); }
