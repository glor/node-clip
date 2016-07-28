"use strict";

var fs = require("fs");
var path = require("path");

var Clipboard = require("./Clipboard");

/*===================================================== Exports  =====================================================*/

module.exports = detect;

/*==================================================== Functions  ====================================================*/

function detect() {
  var files = fs.readdirSync(path.join(__dirname, "systems"));
  if (process.platform === "win32") { return require("./systems/win32"); }
  var file, entity;
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    if (file.substring(file.length - 3) === ".js") {
      entity = require("./systems/" + file.substring(0, file.length - 3));
      if (typeof entity.isSupported === "function" ? entity.isSupported = entity.isSupported() : entity.isSupported) {
        return new Clipboard(entity);
      }
    }
  }
}
