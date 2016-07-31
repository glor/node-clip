"use strict";

var path = require("path");

var ioProcess = require("../ioProcess");

var NAME = "windows";
var CMD_GET = "cscript", CMD_SET = "clip";
var CLIPBOARD_MAIN = "main";
var VBS_PATH = path.join(__dirname, ".\\fallbacks\\paste.vbs");

/*===================================================== Exports  =====================================================*/

exports.name = NAME;
exports.clipboards = [CLIPBOARD_MAIN];
exports.isSupported = process.platform === "win32";

exports.read = read;
exports.write = write;

/*==================================================== Functions  ====================================================*/

function read(ignored, cb) { ioProcess.output(CMD_GET, ["/Nologo", VBS_PATH], cb); }

function write(ignored, value, cb) { ioProcess.input(CMD_SET, [], value, cb); }
