# @hnrchrdl/babel-plugin-import-sideeffects
For any import statement, import one or more sideeffects.

## Why?
This babel plugin enables you to import any sideeffects. This can be useful for example when you import components that need css, but don't have them bundled. Of course it is not limited to css imports, you can import any code with sideeffects.

## This Solution
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
## Basic Usage

```json
// in babel.config.json
{
  plugins: [
    ["@hnrchrdl/babel-plugin-import-sideeffects", {
      sideEffects: {
        "^@some/package$": "[*]/style.css"
      }
    }]
  ]
}
```
## Options
### sideEffects
`object`

default: `{}`

This is an object that declares the patterns for the sideeffects. The object's keys are a regexp pattern to match import sources, the value is a string or an array of strings that hold the import source(s) of sideeffects. For example:
```js
sideEffects: {
  "^@my/package$": "[*]/style.css"
}
```
For full control, the value can also be a function, that takes an object as argument, holding the relevant placeholders. For example:
```js
sideEffects: {
  "@scope/components$": ({ source, scope, package: pkgName, specifier }) => {
    return `${scope}/${pkgName}/dist/${specifier}/styles.css`;
  },
}
```
### insert
`'before' | 'after'`

default `'before'`

Option to prepend or append sideffects. Default is to prepend.

## Placeholders
You can use placeholders to map to some specific import source.

`[*]`:  The full original import source, e.g. '@reach/accordion' if you import from `@reach/accordion`. It will include all paths from the import statement as well.

`[scope]`: The scope of the package, e.g. '@reach' if you import from `@reach/accordion`.

`[package]`: The package name of the package, e.g. 'accordion' if you import from `@reach/accordion`. If the package is not scoped, this will simply be the package name.

`[specifier]`: The specfier for named imports, e.g. for an import statement like `import MyComponent from "my-package"` this will be replace with `MyComponent`.
## Examples
```js
// plugin config
["@hnrchrdl/babel-plugin-import-sideeffects", {
  sideEffects: {
    "^@reach/(accordion|checkbox)$": "[*]/style.css"
  }
}]
// code
import { Accordion,  AccordionItem,  AccordionButton,  AccordionPanel } from "@reach/accordion";
// output
import '@reach/accordion/styles.css'
import { Accordion,  AccordionItem,  AccordionButton,  AccordionPanel,} from "@reach/accordion";
```
```js
// plugin config
["@hnrchrdl/babel-plugin-import-sideeffects", {
  sideEffects: {
    "^my-awesome-library$": ["[package]/global.css", "[package]/[specifier]/style.css"]
  }
}]
// code
import { Component1, Component2 } from 'my-awesome-library'
// output
import 'my-awesome-library/global.css'
import 'my-awesome-library/Component1/styles.css'
import 'my-awesome-library/Component2/styles.css'
import { Component1, Component2 } from 'my-awesome-library'
```
```js
// plugin config
["@hnrchrdl/babel-plugin-import-sideeffects", {
  sideEffects: {
    "^my-awesome-library": ["[*]/style.css"]
  }
}]
// code
import Component1 from 'my-awesome-library/component1'
import Component2 from 'my-awesome-library/component2'
// output
import 'my-awesome-library/component1/styles.css'
import 'my-awesome-library/component2/styles.css'
import Component1 from 'my-awesome-library/component1'
import Component2 from 'my-awesome-library/component2'
```
```js
// plugin config
["@hnrchrdl/babel-plugin-import-sideeffects", {
  sideEffects: {
    "^@my-scope/my-awesome-library$": ({ scope, pkgName, specifier }) =>
      `@${scope}/${pkgName}/dist/${specifier.toLowerCase()}/styles.css`
  },
  insert: 'after'
}]
// code
import { Component } from '@my-scope/my-awesome-library'
// output
import { Component } from '@my-scope/my-awesome-library'
import '@my-scope/my-awesome-library/dist/component/styles.css'
```