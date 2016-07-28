A clipboard module must provide at least the following functions:

 * `readPrimary(callback)`
 * `writePrimary(value, callback)`

It may also provide some more functions as following. Each of those is optional and some have default values generated if not available.

 * `readSecondary(callback)` - default provides `null`
 * `readTertiary(callback)` - default provides `null`
 * `readAll(callback)` - default provides values as implemented
 * `writeSecondary(string, callback)` - default calls `callback` with an error
 * `writeTertiary(string, callback)` - default calls `callback` with an error
 * `writeAll([string|array], callback)` - default calls implemented `write*` with string or array values respectively (skipping `null` values)
 * `clearPrimary(callback)` - default calls `writePrimary` with empty string
 * `clearSecondary(callback)` - default calls `writeSecondary` with empty string
 * `clearTertiary(callback)` - default calls `writeTertiary` with empty string
 * `clearAll(callback)` - default calls all implemented `clear*` functions

If in addition a function `[boolean] isSupported()` is implemented, detection will be handled automatically.
