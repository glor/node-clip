"use strict";

var ioProcess = require("../ioProcess");

var CMD_GET = "cscript", CMD_SET = "clip";

/*===================================================== Exports  =====================================================*/

exports.readPrimary = getter;

exports.writePrimary = function (value, cb) { ioProcess.input(CMD_SET, [], value, cb); };

/*==================================================== Functions  ====================================================*/

function getter(cb) { ioProcess.output(CMD_GET, ["/Nologo", __dirname + "\\fallbacks\\paste.vbs"], cb); }
