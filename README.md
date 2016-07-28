# Node.js Clipboard Manager

A clipboard manager that simplifies the multiple implementations of different systems or services to one unified API.

## Development - Alpha phase

This is an early development version. It is not released yet and has yet to undergo testing.

## Installation

```
npm i --save node-clip
```

## Usage

```
var clip = require("node-clip")();
```

You now can access the following functions:

 * `clip.read(callback)` - Reads the clipboard content.
 * `clip.write(value:String, callback)` - Writes `value` into the clipboard.
 * `clip.clear(callback)` - Clears the content of the clipboard.
 * `clip.readAll(callback)` - Reads the content of all available clipboards and returns an array.
 * `clip.writeAll(values:String|Array, callback)` - Writes `values` into respective clipboards.
 * `clip.clearAll(callback)` - Clears the content of all available clipboards.

Each of the `read`, `write` and `clear` functions can be suffixed with `Primary`, `Secondary` and `Tertiary` to specify the desired clipboard. Without suffix, the `Primary` clipboard is used.
Using X11 (via `xclip`) for example, `Primary` is the traditional clipboard (e.g. `Ctrl+C` and `Ctrl+V`); `Secondary` references the mouse selection and can commonly be pasted via middle-click; `Tertiary` is ill-defined and not used very often.
Whether a system does support a `Secondary` and/or `Tertiary` can be checked via the `clip.MAY_{READ|WRITE|CLEAR}_{SECONDARY|TERTIARY}` flags.

Callbacks get called according to the node.js convention: `callback(error, value)`

## Support

This package serves the Windows and Darwin OS X platforms as well as the following services (e.g. for GNU/Linux):

 * `xclip`
