"use strict";

var fs = require("fs");
var path = require("path");

var Clipboard = require("./Clipboard");
var detection = require("./detection");

var activeClipboard = null;
var instances = {};

/*===================================================== Exports  =====================================================*/

module.exports = getInstance;

/*==================================================== Functions  ====================================================*/

function getInstance(name) {
  if (typeof name !== "string") { return activeClipboard = activeClipboard || detection(); }
  if (instances.hasOwnProperty(name)) { return instances[name]; }
  var file = path.join(__dirname, "systems", name + ".js");
  var instance = instances[name] = new Clipboard(require(fs.accessSync(file) ? "./systems/" + name : name));
  if (activeClipboard == null) { activeClipboard = instance; }
  return instance;
}
