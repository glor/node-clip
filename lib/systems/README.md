A clipboard module must provide at least the following properties:

| Property | Type | Description |
|---| --- | --- |
| `name` | `String` | Identifier of the system or clipboard API. |
| `clipboards` | `String[]` | Array of available clipboard identifications. |
| `read` | `Function(String clipboard, callback)` | Calls callback with the content read from the clipboard or `null` if clipboard not supported. |
| `write` | `Function(String clipboard, String value, callback)` | Writes the given value to the clipboard and calls callback with `true`; `false` if the clipboard has not been found. |

To enable detection, a module must provide a `Boolean` or `[Boolean] Function` as property `isSupported`. It should be/return `true` if the underlying clipboard API is available. It's called at most once.

The following properties may also be provided to overwrite the default behavior:

| Property | Type | Default description |
| --- | --- | --- |
| `clear` | `Function(String clipboard, callback)` | Call `write(clipboard, "", callback)`. |
| `readAll` | `Function(callback)` | Call `read` for each available clipboard and call callback with retrieved values. |
| `writeAll` | `Function(String|String[]|Object values, callback)` | Call `write` for each available clipboard with respective value and call callback with retrieved values. |
| `clearAll` | `Function(callback)` | Call `writeAll("", callback)`. |
