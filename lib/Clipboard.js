"use strict";

var EMPTY_STRING = "";
var FUNCTION_TYPE = "function";

//noinspection JSUnusedGlobalSymbols
var fb = (function Fallback() {}).prototype;

/*===================================================== Exports  =====================================================*/

module.exports = Clipboard;

/*==================================================== Functions  ====================================================*/

/*----------------------------------------------------- Fallback -----------------------------------------------------*/

fb.read = function (cb) { process.nextTick(function () { cb(null, null); }); };
fb.write = function (value, cb) {
  process.nextTick(function () { cb(new Error("Clipboard write not implemented for underlying system.")); });
};

fb.clearPrimary = function (cb) { this.writePrimary(EMPTY_STRING, cb); };
fb.clearSecondary = function (cb) { this.writeSecondary(EMPTY_STRING, cb); };
fb.clearTertiary = function (cb) { this.writeTertiary(EMPTY_STRING, cb); };

fb.readAll = function (cb) {
  var result = [];
  var waiting = 3;
  this.readPrimary(function (err, val) { next(err, 0, val); });
  this.readSecondary(function (err, val) { next(err, 1, val); });
  this.readTertiary(function (err, val) { next(err, 2, val); });

  function next(err, idx, val) {
    if (err != null) { return cb(err); }
    result[idx] = val;
    if (!--waiting) { cb(null, result); }
  }
};

fb.clearAll = function (cb) {
  var waiting = 3;
  this.clearPrimary(next);
  if (this.MAY_CLEAR_SECONDARY) { this.clearSecondary(next); } else { next(); }
  if (this.MAY_CLEAR_TERTIARY) { this.clearTertiary(next); } else { next(); }

  function next(err) { if (err != null) { cb(err); } else if (!--waiting) { cb(); } }
};

fb.writeAll = function (value, cb) {
  var waiting = 3;
  if (typeof value === "string") {
    this.writePrimary(value, next);
    if (this.MAY_WRITE_SECONDARY) { this.writeSecondary(value, next); } else { next(); }
    if (this.MAY_WRITE_TERTIARY) { this.writeTertiary(value, next); } else { next(); }
  } else {
    if (value[0] != null) { this.writePrimary(value[0], next); } else { next(); }
    if (value[1] != null && this.MAY_WRITE_SECONDARY) { this.writeSecondary(value[1], next); } else { next(); }
    if (value[2] != null && this.MAY_WRITE_TERTIARY) { this.writeTertiary(value[2], next); } else { next(); }
  }

  function next(err) { if (err != null) { cb(err); } else if (!--waiting) { cb(); } }
};

/*---------------------------------------------------- Clipboard  ----------------------------------------------------*/

function Clipboard(entity) {
  this.read = this.readPrimary = entity.readPrimary;
  this.write = this.writePrimary = entity.writePrimary;
  this.clear = this.clearPrimary = (typeof entity.clearPrimary === FUNCTION_TYPE ? entity : fb).clearPrimary;

  this.MAY_READ_SECONDARY = typeof entity.readSecondary === FUNCTION_TYPE;
  this.MAY_READ_TERTIARY = typeof entity.readTertiary === FUNCTION_TYPE;

  this.readSecondary = entity.MAY_READ_SECONDARY ? entity.readSecondary : fb.read;
  this.readTertiary = entity.MAY_READ_TERTIARY ? entity.readTertiary : fb.read;

  this.MAY_WRITE_SECONDARY = typeof entity.writeSecondary === FUNCTION_TYPE;
  this.MAY_WRITE_TERTIARY = typeof entity.writeTertiary === FUNCTION_TYPE;
  this.MAY_CLEAR_SECONDARY = typeof entity.clearSecondary === FUNCTION_TYPE;
  this.MAY_CLEAR_TERTIARY = typeof entity.clearTertiary === FUNCTION_TYPE;

  this.clearSecondary = this.MAY_CLEAR_SECONDARY ? entity.clearSecondary : fb.clearSecondary;
  this.clearTertiary = this.MAY_CLEAR_TERTIARY ? entity.clearTertiary : fb.clearTertiary;

  this.writeSecondary = this.MAY_WRITE_SECONDARY ? entity.writeSecondary : fb.write;
  this.writeTertiary = this.MAY_WRITE_TERTIARY ? entity.writeTertiary : fb.write;

  if (this.MAY_WRITE_SECONDARY) { this.MAY_CLEAR_SECONDARY = true; }
  if (this.MAY_WRITE_TERTIARY) { this.MAY_CLEAR_TERTIARY = true; }

  this.readAll = typeof entity.readAll === FUNCTION_TYPE ? entity.readAll : fb.readAll;
  this.writeAll = typeof entity.writeAll === FUNCTION_TYPE ? entity.writeAll : fb.writeAll;
  this.clearAll = typeof entity.clearAll === FUNCTION_TYPE ? entity.clearAll : fb.clearAll;
}
