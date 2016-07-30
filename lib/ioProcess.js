"use strict";

var childProcess = require("child_process");

var spawn = childProcess.spawn;
var spawnSync = childProcess.spawnSync;

var INPUT_OPTIONS = {stdio: ['pipe', 'ignore', 'ignore']};
var EXISTS_OPTIONS = {stdio: 'ignore', shell: true};

/*===================================================== Exports  =====================================================*/

exports.input = startInputProcess;
exports.output = startOutputProcess;
exports.exists = exists;

/*==================================================== Functions  ====================================================*/

function startInputProcess(cmd, args, input, cb) {
  var child = spawn(cmd, args, INPUT_OPTIONS);
  child.on("close", function (code) {
    if (code === 0) { cb(null, true); } else { cb(new Error(cmd + " did not shut down properly. Exit code: " + code)); }
  });
  child.stdin.end(input);
}

function startOutputProcess(cmd, args, cb) {
  var child = spawn(cmd, args, {stdio: ['ignore', 'pipe', 'ignore']});
  var data = "";
  child.stdout.on("data", function (chunk) { data += chunk; });
  child.on("close", function (code) {
    if (code === 0) { cb(null, data); } else { cb(new Error(cmd + " did not shut down properly. Exit code: " + code)); }
  });
}

function exists(cmd) { return spawnSync("which", [cmd], EXISTS_OPTIONS).status === 0; }
