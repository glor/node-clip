"use strict";

var ioProcess = require("../ioProcess");

var SELECTION_PRIMARY = "general";
var SELECTION_SECONDARY = "ruler";
var SELECTION_TERTIARY = "find";

var CMD_GET = "pbpaste", CMD_SET = "pbcopy";

/*===================================================== Exports  =====================================================*/

exports.readPrimary = function (cb) { getter(SELECTION_PRIMARY, cb); };
exports.readSecondary = function (cb) { getter(SELECTION_SECONDARY, cb); };
exports.readTertiary = function (cb) { getter(SELECTION_TERTIARY, cb); };

exports.writePrimary = function (value, cb) { setter(SELECTION_PRIMARY, value, cb); };
exports.writeSecondary = function (value, cb) { setter(SELECTION_SECONDARY, value, cb); };
exports.writeTertiary = function (value, cb) { setter(SELECTION_TERTIARY, value, cb); };

exports.isSupported = function () { return ioProcess.exists(CMD_SET) && ioProcess.exists(CMD_GET); };

/*==================================================== Functions  ====================================================*/

function getter(selection, cb) { ioProcess.output(CMD_GET, ["-pboard", selection], cb); }

function setter(selection, value, cb) { ioProcess.input(CMD_SET, ["-pboard", selection], value, cb); }
