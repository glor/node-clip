"use strict";

var ioProcess = require("../ioProcess");

var NAME = "darwin";
var CMD_GET = "pbpaste", CMD_SET = "pbcopy";
var CLIPBOARDS = ["general", "ruler", "find", "font"];

/*===================================================== Exports  =====================================================*/

exports.name = NAME;
exports.clipboards = CLIPBOARDS;

exports.read = read;
exports.write = write;
exports.isSupported = function () { return ioProcess.exists(CMD_SET) && ioProcess.exists(CMD_GET); };

/*==================================================== Functions  ====================================================*/

function read(clipboard, cb) { ioProcess.output(CMD_GET, ["-pboard", clipboard], cb); }

function write(clipboard, value, cb) { ioProcess.input(CMD_SET, ["-pboard", clipboard], value, cb); }
