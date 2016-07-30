# Node.js Clipboard Manager

[![License](https://img.shields.io/npm/l/node-clip.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/node-clip.svg)](https://www.npmjs.com/package/node-clip)
[![Dependency Status](https://david-dm.org/frissdiegurke/node-clip.svg)](https://david-dm.org/frissdiegurke/node-clip)
[![Downloads](https://img.shields.io/npm/dt/node-clip.svg)](https://www.npmjs.com/package/node-clip)

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

All available exports of the main module are as following (the exports object itself is an alias for `get`):

| Property | Type | Description |
| --- | --- | --- |
| `get` | `[Clipboard] Function([String|String[]|Object filter], [Boolean force])` | Returns an instance of the `Clipboard` class. A specified `filter` may restrict the systems to use (`String|String[]`) or define the clipboard module (`Object`; See [specification](./lib/systems/README.md)). If `force` is `true`, the first matching system gets used. |
| `use` | `Function(String|Object)` | Register a plugin to use in addition to default systems. The plugin must follow the [specification](./lib/systems/README.md). |
| `noCache` | `[Clipboard] Function([String|String[]|Object filter], [Boolean force])` | Similar to `get` but does not use caching. |

Instance of the `Clipboard` class provide the following properties:

| Property | Type | Description |
|---| --- | --- |
| `name` | `String` | Identifier of the system or clipboard API in use. |
| `clipboards` | `String[]` | Array of available clipboard identifications that can be used for `read`, `write` and `clear`. |
| `isDetected` | `Boolean` | Whether the clipboard system in use has been detected on the platform. If this is not the case, the platform is not supported by `node-clip`. |
| `read` | `Function(String clipboard, callback)` | Calls callback with the content read from the clipboard or `null` if the clipboard is not supported. |
| `write` | `Function(String clipboard, String value, callback)` | Writes the given value to the clipboard and calls callback with `true`; `false` if the clipboard is not supported. |
| `clear` | `Function(String clipboard, callback)` | Clears the clipboard and calls callback with `true`; `false` if the clipboard is not supported. |
| `readAll` | `Function(callback)` | Calls callback with the contents read from all available clipboards. |
| `writeAll` | `Function(String|String[]|Object value, callback)` | Writes the given value(s) to the respective clipboards. |
| `clearAll` | `Function(callback)` | Clears all available clipboards. |
| `readPrimary`, `readSecondary`, `readTertiary` | `Function(callback)` | Calls callback with the content read from the respective clipboard or `null` if the clipboard is not supported. |
| `writePrimary`, `writeSecondary`, `writeTertiary` | `Function(String value, callback)` | Writes the given value to the respective clipboard and calls callback with `true`; `false` if the clipboard is not supported. |
| `clearPrimary`, `clearSecondary`, `clearTertiary` | `Function(callback)` | Clears the respective clipboard and calls callback with `true`; `false` if the clipboard is not supported. |
| `HAS_PRIMARY`, `HAS_SECONDARY`, `HAS_TERTIARY` | `Boolean` | Flags to determine whether the respective clipboards are available on the platform. |

It is not recommended to use the `clipboards`, `read`, `write` and `clear` properties since those are defined platform-dependent. Use those only when specific access is needed.
The `Primary`, `Secondary` and `Tertiary` clipboards are defined with best efforts of the developer to provide a platform-independent API. Keep in mind however that not all of them are available for each system.

For the X-Server within GNU/Linux the definition is as following (according to [ICCCM](https://tronche.com/gui/x/icccm/sec-2.html#s-2.6.1)):

 * `Primary`: The `CLIPBOARD` Selection; Usually available via `Ctrl+C`, etc.
 * `Secondary`: The `PRIMARY` Selection; Usually copied by text-selection and pasted by middle-click or `Shift+Insert`.
 * `Tertiary`: The `SECONDARY` Selection.

All callbacks are called asynchronously, following the node.js convention `callback(error, value)`.

## Support

This package serves the Windows and Darwin OS X platforms as well as the following services (e.g. for GNU/Linux):

 * `xclip`

Additional platforms may be supported via plugins.
