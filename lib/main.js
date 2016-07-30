"use strict";

var fs = require("fs");

var cache = require("./cache");
var detection = require("./detection");

var Clipboard = require("./Clipboard");

var plugins = null;
var activeClip = null;

/*===================================================== Exports  =====================================================*/

module.exports = getInstance;
module.exports.use = use;
module.exports.get = getInstance;
module.exports.noCache = noCache;

/*================================================ Initial Execution  ================================================*/

loadPolyfills();

/*==================================================== Functions  ====================================================*/

function use(plugin) {
  if (plugins == null) { plugins = []; }
  plugins.push(typeof plugin === "string" ? require(plugin) : plugin);
}

function getInstance(filter, force) {
  var mod = filter == null && activeClip != null ? activeClip : getModuleObject(filter, force);
  return cache.getInstance(mod);
}

function noCache(filter, force) { return new Clipboard(getModuleObject(filter, force)); }

function getModuleObject(filter, force) {
  if (typeof filter === "boolean") {
    force = filter;
    filter = null;
  }
  if (typeof filter === "string") { filter = [filter]; }
  var isArray = Array.isArray(filter), isObject = !isArray && typeof filter === "object" && filter !== null;
  if (isObject) { return filter; }
  if (!isArray && filter != null) { throw new TypeError("Filter needs to be a string, object, array or undefined."); }
  var mod = detection.search(filter, force, plugins);
  if (mod == null) {
    if (isArray) { throw new Error("Requested clipboard API not found."); } else { return detection.fallback; }
  }
  return mod;
}

function loadPolyfills() {
  require("./polyfills/ArrayIncludes");
}
