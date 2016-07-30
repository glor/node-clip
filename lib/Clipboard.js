"use strict";

var EMPTY_STRING = "";
var SUFFIXES = ["Primary", "Secondary", "Tertiary"];

//noinspection JSUnusedGlobalSymbols
var fb = (function Fallback() {}).prototype;

/*===================================================== Exports  =====================================================*/

module.exports = Clipboard;

/*==================================================== Functions  ====================================================*/

function rejectRead(cb) { process.nextTick(function () { cb(null, null); }); }
function rejectWrite(ignored, cb) { process.nextTick(function () { cb(null, false); }); }

function readSuffixGen(clipboard, clip) { return function (cb) { clip._read(clipboard, cb); }; }
function writeSuffixGen(clipboard, clip) { return function (value, cb) { clip._write(clipboard, value, cb); }; }
function clearSuffixGen(clipboard, clip) { return function (cb) { clip._clear(clipboard, cb); }; }

/*----------------------------------------------------- Fallback -----------------------------------------------------*/

fb.read = function (clipboard, cb) {
  if (typeof clipboard === "number") { clipboard = this.clipboards[clipboard]; }
  if (typeof clipboard === "string" && this.clipboards.includes(clipboard)) {
    this._read(cb);
  } else {
    rejectRead(cb);
  }
};

fb.write = function (clipboard, value, cb) {
  if (typeof clipboard === "number") { clipboard = this.clipboards[clipboard]; }
  if (typeof clipboard === "string" && this.clipboards.includes(clipboard)) {
    this._write(value, cb);
  } else {
    rejectWrite(null, cb);
  }
};

fb._clear = function (clipboard, cb) { return this._write(clipboard, EMPTY_STRING, cb); };
fb.clear = function (clipboard, cb) {
  if (typeof clipboard === "number") { clipboard = this.clipboards[clipboard]; }
  if (typeof clipboard === "string" && this.clipboards.includes(clipboard)) {
    this._clear(clipboard, cb);
  } else {
    rejectWrite(null, cb);
  }
};

fb.readAll = function (cb) {
  var self = this;
  var result = [];
  var clipboards = self.clipboards;
  var waiting = clipboards.length;
  if (!waiting) { return cb(null, result); }
  for (var i = 0; i < clipboards.length; i++) { iteratee(i, clipboards[i]); }

  function iteratee(i, clipboard) { self.read(clipboard, function (err, val) { next(err, i, val); }); }

  function next(err, idx, val) {
    if (err != null) { return cb(err); }
    result[idx] = val;
    if (!--waiting) { cb(null, result); }
  }
};

fb.writeAll = function (value, cb) {
  var self = this;
  var result = [];
  var clipboards = self.clipboards;
  var waiting = clipboards.length;
  if (!waiting) { return cb(null, result); }
  var type = typeof value;
  var isString = type === "string", isArray = Array.isArray(value), isObject = type === "object" && value !== null;
  var val;
  for (var i = 0; i < clipboards.length; i++) {
    var clipboard = clipboards[i];
    val = isString ? value : isArray ? value[i] : isObject ? value[clipboard] : null;
    if (clipboard != null && val != null) { iteratee(i, val, clipboard); } else { next(null, i, void 0); }
  }

  function iteratee(i, val, clipboard) { self.write(clipboard, val, function (err, v) { next(err, i, v); }); }

  function next(err, idx, val) {
    if (err != null) { return cb(err); }
    result[idx] = val;
    if (!--waiting) { cb(null, result); }
  }
};

fb.clearAll = function (cb) { this.writeAll("", cb); };

/*---------------------------------------------------- Clipboard  ----------------------------------------------------*/

function Clipboard(mod) {
  if (typeof mod.name !== "string") { throw new Error("Module name must be a string."); }
  var self = this;

  this.name = mod.name;
  this.clipboards = [];
  this.isDetected = typeof mod.isSupported === "function" ? mod.isSupported = mod.isSupported() : !!mod.isSupported;

  // functions to call when ensured that clipboard is available
  this._read = mod.read;
  this._write = mod.write;
  this._clear = typeof mod.clear === "function" ? mod.clear : fb._clear;

  this.read = fb.read;
  this.write = fb.write;
  this.clear = fb.clear;

  this.readAll = typeof mod.readAll === "function" ? mod.readAll : fb.readAll;
  this.writeAll = typeof mod.writeAll === "function" ? mod.writeAll : fb.writeAll;
  this.clearAll = typeof mod.clearAll === "function" ? mod.clearAll : fb.clearAll;

  var clipboards = mod.clipboards, clipboard, i;
  for (i = 0; i < clipboards.length; i++) {
    clipboard = clipboards[i];
    clipboard = typeof clipboard === "string" ? clipboard : null;
    self.clipboards.push(clipboard);
    if (i < SUFFIXES.length) { addSuffixExports(SUFFIXES[i], clipboard); }
  }
  while (i < SUFFIXES.length) {
    addSuffixExports(SUFFIXES[i]);
    i++;
  }

  function addSuffixExports(suffix, clipboard) {
    if (self["HAS_" + suffix.toUpperCase()] = clipboard != null) {
      self["read" + suffix] = readSuffixGen(clipboard, self);
      self["write" + suffix] = writeSuffixGen(clipboard, self);
      self["clear" + suffix] = clearSuffixGen(clipboard, self);
    } else {
      self["read" + suffix] = rejectRead;
      self["write" + suffix] = rejectWrite;
      self["clear" + suffix] = rejectWrite;
    }
  }
}
