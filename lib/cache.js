"use strict";

var Clipboard = require("./Clipboard");

var nextId = 0;
var cache = {};

/*===================================================== Exports  =====================================================*/

exports.getInstance = getInstance;

/*==================================================== Functions  ====================================================*/

function getInstance(mod) {
  if (!mod.hasOwnProperty("__clipboardId")) { mod.__clipboardId = nextId++; }
  var id = mod.__clipboardId;
  if (cache.hasOwnProperty(id)) { return cache[id]; }
  return cache[id] = new Clipboard(mod);
}
