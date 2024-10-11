# rollup-plugin-sass-bundle  

[![issues](https://img.shields.io/github/issues/vrtexe/rollup-plugin-sass-bundle.svg?style=flat-square)](https://www.npmjs.com/package/rollup-plugin-sass-bundle) [![npm](https://img.shields.io/npm/v/rollup-plugin-sass-bundle.svg?style=flat-square)](https://www.npmjs.com/package/rollup-plugin-sass-bundle) [![mit](https://img.shields.io/npm/l/rollup-plugin-sass-bundle.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## Install

```sh
npm install -D rollup-plugin-sass-bundle
```

## Description

A simple **`rollup`** plugin that only delegates to the **`sass`** runtime used to transpile `sass` files to `css` and bundles it all in a single file, optionally bundling can be turned off, in that case the plugin just transforms the files and rollup passes it on to the other plugins.

## Usage

```js
// rollup.config.js
import sass from 'rollup-plugin-sass-bundle';

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'esm',
  },
  plugins: [
    sass({
      bundleOptions: {
        enabled: true,
        name: 'bundle.css'
      }
    })
  ]
}
```

## Config

### `include` and `exclude`

Type: `String | RegExp | Array[...String|RegExp]`<br>

Default:
  - `include`: `['**/*.scss', '**/*.sass']`
  - `exclude`: `undefined`

A valid [`picomatch`](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns. If `options.include` is omitted or has zero length, filter will return `true` by default. Otherwise, an ID must match one or more of the `picomatch` patterns, and must not match any of the `options.exclude` patterns.

Note that `picomatch` patterns are very similar to [`minimatch`](https://github.com/isaacs/minimatch#readme) patterns, and in most use cases, they are interchangeable. If you have more specific pattern matching needs, you can view [this comparison table](https://github.com/micromatch/picomatch#library-comparisons) to learn more about where the libraries differ.

### `loadPaths`

Type: `string[] | undefined`

Additional loaded paths passed to the [`sass compiler`](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/#loadPaths)

By default only the current directory of the file transformed by rollup and the root directory is passed

### `runtime`

Type: [`SassCompiler`](https://sass-lang.com/documentation/js-api/classes/compiler/)

`Default`: Would look for and try to import [`sass`]('https://www.npmjs.com/package/sass')

Provide a custom runtime to use instead of the default one.



### `sourceMap`

Type: `boolean | undefined`

Default: `false`

Generate source map

### `sassOptions`

Type: [`SassOptions`](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)

Pass or override any sass options, to configure the compilation process.

Importers can be provided here for example resolving node_modules imports using `~` syntax, see [nodepackageimporter](https://sass-lang.com/documentation/js-api/classes/nodepackageimporter/)
Please do not override `loadPaths` and use the option provided by the plugin, because that would remove the current directory of the processed file and the root directory already provided.

### `bundleOptions`

Type: `Object`

#### `enabled`

Type: `boolean | undefined`

Default: `true`

When this option is disabled, the plugin would only compile the `sass` files and you would be expected to bundle them yourself or pass it to a different plugin.

#### `name` and `fileName`

Type: `string | undefined`

Default: 
  - `name`: `undefined`
  - `filename`: `undefined`

The `name` and `fileName` options would be passed to the rollup [`emitFile`](https://rollupjs.org/plugin-development/#this-emitfile) hook.

When emitting chunks or assets, either a `name` or a `fileName` can be supplied. If a `fileName` is provided, it will be used unmodified as the name of the generated file, throwing an error if this causes a conflict. Otherwise, if a `name` is supplied, this will be used as substitution for `[name]` in the corresponding `output.chunkFileNames` or `output.assetFileNames` pattern, possibly adding a unique number to the end of the file name to avoid conflicts. If neither a `name` nor `fileName` is supplied, a default name will be used. Prebuilt chunks must always have a fileName.

#### `include` and `exclude`

Type: `String | RegExp | Array[...String|RegExp]`<br>

Default:
  - `include`: `['**/*.scss', '**/*.sass', '**/*.css']`
  - `exclude`: `undefined`

Same as the base plugin options but these options apply only when bunding, by default this option also includes

A valid [`picomatch`](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns. If `options.include` is omitted or has zero length, filter will return `true` by default. Otherwise, an ID must match one or more of the `picomatch` patterns, and must not match any of the `options.exclude` patterns.

Note that `picomatch` patterns are very similar to [`minimatch`](https://github.com/isaacs/minimatch#readme) patterns, and in most use cases, they are interchangeable. If you have more specific pattern matching needs, you can view [this comparison table](https://github.com/micromatch/picomatch#library-comparisons) to learn more about where the libraries differ.


## License

[MIT](https://github.com/vrtexe/rollup-plugin-sass-bundle/blob/main/LICENSE)
