"use strict";

var crypto = require("crypto");

var SUFFIXES = ["Primary", "Secondary", "Tertiary"];

var clip = require("../lib/main")("windows");

console.log("Using system: '" + clip.name + "'");

for (var i = 0; i < SUFFIXES.length; i++) { iteratee(SUFFIXES[i], SUFFIXES[i].toUpperCase()); }

function iteratee(suffix, upper) {
  var check = crypto.randomBytes(16).toString("hex");
  console.log(suffix + " tests started...");
  clip["write" + suffix](check, function (err, value) {
    if (err != null) { throw err; }
    if (value === true) {
      console.log(suffix + " written.");
      clip["read" + suffix](function (err, value) {
        if (err != null) { throw err; }
        console.log(suffix + " read.");
        if (value !== check) { throw new Error("Test sequence of " + upper + " mismatch."); }
        clip["clear" + suffix](function (err, value) {
          if (err != null) { throw err; }
          if (value !== true) { throw new Error("Clear of " + upper + " failed."); }
          console.log(suffix + " cleared.");
          clip["read" + suffix](function (err, value) {
            if (value) { throw new Error("Clear of " + upper + " did not clear property.")}
            console.log(suffix + " passed (checked with '" + check + "').");
          });
        });
      });
    } else {
      if (clip["HAS_" + upper]) { throw new Error("Module wrongly claims support of " + upper + " clipboard."); }
      console.warn(suffix + " clipboard not supported.");
    }
  });
}
