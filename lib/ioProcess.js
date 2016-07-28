"use strict";

var childProcess = require("child_process");

var spawn = childProcess.spawn;
var spawnSync = childProcess.spawnSync;

/*===================================================== Exports  =====================================================*/

exports.input = startInputProcess;
exports.output = startOutputProcess;
exports.exists = exists;

/*==================================================== Functions  ====================================================*/

function startInputProcess(cmd, args, input, cb) {
  var child = spawn(cmd, args);
  child.on("close", function (code) {
    if (code !== 0) { cb(new Error(cmd + " did not shut down properly. Exit code: " + code)); } else { cb(null); }
  });
  child.stdin.end(input);
}

function startOutputProcess(cmd, args, cb) {
  var child = spawn(cmd, args);
  var data = "";
  child.stdout.on("data", function (chunk) { data += chunk; });
  child.on("close", function (code) {
    if (code !== 0) { cb(new Error(cmd + " did not shut down properly. Exit code: " + code)); } else { cb(null, data); }
  });
}

function exists(cmd) { return spawnSync("which", [cmd]).status === 0; }
