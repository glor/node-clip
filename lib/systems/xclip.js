"use strict";

var ioProcess = require("../ioProcess");

var CMD = "xclip";
var NAME = "xclip";
var CLIPBOARDS = ["clipboard", "primary", "secondary"];

/*===================================================== Exports  =====================================================*/

exports.name = NAME;
exports.clipboards = CLIPBOARDS;

exports.read = read;
exports.write = write;
exports.isSupported = function () { return ioProcess.exists(CMD); };

/*==================================================== Functions  ====================================================*/

function read(clipboard, cb) { ioProcess.output(CMD, ["-o", "-selection", clipboard], cb); }

function write(clipboard, value, cb) { ioProcess.input(CMD, ["-i", "-l", "0", "-selection", clipboard], value, cb); }
