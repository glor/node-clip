"use strict";

var fs = require("fs");
var path = require("path");

var Clipboard = require("./Clipboard");

var systems = null;

/*===================================================== Exports  =====================================================*/

exports.fallback = {name: "noop", clipboards: []};

exports.search = search;

/*==================================================== Functions  ====================================================*/

function getSystems() {
  if (systems !== null) { return systems; }
  systems = [];
  var files = fs.readdirSync(path.join(__dirname, "systems"));
  var file;
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    if (file.substring(file.length - 3) === ".js") {
      systems.push(require("./systems/" + file.substring(0, file.length - 3)));
    }
  }
  return systems;
}

function search(filter, force, plugins) {
  var modules = getSystems();
  if (plugins != null) { modules = modules.concat(plugins); } // append plugins; internal modules have higher priority
  var withFilter = Array.isArray(filter);
  var mod;
  for (var i = 0; i < modules.length; i++) {
    mod = modules[i];
    if (withFilter) {
      if (filter.includes(mod.name) && (checkSupport(mod) || force)) { return mod; }
    } else if (checkSupport(mod)) {
      return mod;
    }
  }
}

function checkSupport(mod) {
  return typeof mod.isSupported === "function" ? mod.isSupported = mod.isSupported() : mod.isSupported;
}
