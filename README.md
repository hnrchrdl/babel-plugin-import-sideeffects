# @hnrchrdl/babel-plugin-import-sideeffects
For any import statement, import one or more sideeffects.

## Why?
This babel plugin enables you to import any sideeffects. This can be useful for example when you import components that need css, but don't have them bundled. Of course it is not limited to css imports, you can import any code with sideeffects.

## Example
In your code, you have an import statement like this
```js
import MyComponent from '@my/library'
```
This plugin would allow you to change these imports to something like this:
```js
import '@my/library/styles.css'
import MyComponent from '@my/library'
```
See examples below on how to configure the plugin to achieve this.
## Installation

```bash
# yarn
yarn add -D @hnrchrdl/babel-plugin-import-sideeffects
# npm
npm install --save-dev @hnrchrdl/babel-plugin-import-sideeffects
```
## Configuration

```json
{
  plugins: [
    ["@hnrchrdl/babel-plugin-import-sideeffects", {
      ["^@some/package$"]: "[*]/style.css"
    }]
  ]
}
```
## Examples
```js
// code
import MyComponent from '@my/library'
// plugin config
// [*] gets replaced with the actual import source value
["@hnrchrdl/babel-plugin-import-sideeffects", {
  ["^@my/package$"]: "[*]/style.css"
}]
// output
import '@my/library/styles.css'
import MyComponent from '@my/library'
```
```js
// code
import MyComponent from '@my/library'
// plugin config
["@hnrchrdl/babel-plugin-import-sideeffects", {
  ["^@my/library$"]: "someOtherPackage/style.css"
}]
// output
import 'someOtherPackage/styles.css'
import MyComponent from '@my/library'
```
```js
// code
import MyComponent from '@my/library/component'
// plugin config
["@hnrchrdl/babel-plugin-import-sideeffects", {
  ["^@my/library(.*)"]: "[*]/style.css"
}]
// output
import '@my/library/component/styles.css'
import MyComponent from '@my/library/component'
```
```js
// code
import MyComponent from '@my/library'
// plugin config
["@hnrchrdl/babel-plugin-import-sideeffects", {
  ["^@my/library$"]: ["[*]/style.css", "[*]/more.css"]
}]
// output
import '@my/library/styles.css'
import '@my/library/more.css'
import MyComponent from '@my/library'
```