"use strict";

var ioProcess = require("../ioProcess");

var SELECTION_PRIMARY = "clipboard";
var SELECTION_SECONDARY = "primary";
var SELECTION_TERTIARY = "secondary";

var CMD = "xclip";

/*===================================================== Exports  =====================================================*/

exports.readPrimary = function (cb) { getter(SELECTION_PRIMARY, cb); };
exports.readSecondary = function (cb) { getter(SELECTION_SECONDARY, cb); };
exports.readTertiary = function (cb) { getter(SELECTION_TERTIARY, cb); };

exports.writePrimary = function (value, cb) { setter(SELECTION_PRIMARY, value, cb); };
exports.writeSecondary = function (value, cb) { setter(SELECTION_SECONDARY, value, cb); };
exports.writeTertiary = function (value, cb) { setter(SELECTION_TERTIARY, value, cb); };

exports.isSupported = function () { return ioProcess.exists(CMD); };

/*==================================================== Functions  ====================================================*/

function getter(selection, cb) { ioProcess.output(CMD, ["-o", "-selection", selection], cb); }

function setter(selection, value, cb) { ioProcess.input(CMD, ["-i", "-l", "0", "-selection", selection], value, cb); }
