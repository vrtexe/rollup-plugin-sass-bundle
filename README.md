# rollup-plugin-sass-bundle

Compile Sass and SCSS inside Rollup and emit them as one bundled CSS file, or hand each compiled stylesheet to the rest of your pipeline.

[![npm version](https://img.shields.io/npm/v/rollup-plugin-sass-bundle.svg?style=flat-square)](https://www.npmjs.com/package/rollup-plugin-sass-bundle)
[![types](https://img.shields.io/npm/types/rollup-plugin-sass-bundle.svg?style=flat-square)](index.d.ts)
[![license](https://img.shields.io/npm/l/rollup-plugin-sass-bundle.svg?style=flat-square)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](package.json)
[![issues](https://img.shields.io/github/issues/vrtexe/rollup-plugin-sass-bundle.svg?style=flat-square)](https://github.com/vrtexe/rollup-plugin-sass-bundle/issues)

## Why this plugin

- **One CSS asset per build.** Every matched stylesheet is collected during `transform` and written once as a single file in `generateBundle`.
- **Modern Sass API.** Compilation uses `sass` `compileString`, not the legacy `render` entry points.
- **Bring your own compiler.** Pass `runtime` to swap in a fork or a wrapper that exposes `compileString`.
- **Bundling is optional.** With `bundleOptions.enabled` off, the plugin only compiles each stylesheet and Rollup passes the result to your next plugin.
- **TypeScript included.** `index.d.ts` ships with the package and is exported, so `rollup.config.ts` gets typed options without `@types`. The option types reference the `sass` and `rollup` type definitions.

## Install

```sh
npm install -D rollup-plugin-sass-bundle sass
```

`sass` is a peer dependency and is optional only if you supply your own `runtime`.

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

## Description

A simple **`rollup`** plugin that only delegates to the **`sass`** runtime used to transpile `sass` files to `css` and bundles it all in a single file, optionally bundling can be turned off, in that case the plugin just transforms the files and rollup passes it on to the other plugins.

## Config

### `include` and `exclude`

Type: `String | RegExp | Array[...String|RegExp]`<br>

Default:
  - `include`: `['**/*.scss', '**/*.sass']`
  - `exclude`: `undefined`

A valid [`picomatch`](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns. If `options.include` is omitted or has zero length, filter will return `true` by default. Otherwise, an ID must match one or more of the `picomatch` patterns, and must not match any of the `options.exclude` patterns.

Note that `picomatch` patterns are very similar to [`minimatch`](https://github.com/isaacs/minimatch#readme) patterns, and in most use cases, they are interchangeable. If you have more specific pattern matching needs, you can view [this comparison table](https://github.com/micromatch/picomatch#library-comparisons) where the libraries differ.

### `loadPaths`

Type: `string[] | undefined`

Additional loaded paths passed to the [`sass compiler`](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/#loadPaths)

By default only the current directory of the file transformed by rollup and the root directory is passed

### `runtime`

Type: [`SassCompiler`](https://sass-lang.com/documentation/js-api/classes/compiler/)

`Default`: Would look for and try to import [`sass`](https://www.npmjs.com/package/sass)

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

The bundled asset is emitted from `generateBundle` on write builds. Calling `rollup.generate()` without writing produces no CSS file.

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

Note that `picomatch` patterns are very similar to [`minimatch`](https://github.com/isaacs/minimatch#readme) patterns, and in most use cases, they are interchangeable. If you have more specific pattern matching needs, you can view [this comparison table](https://github.com/micromatch/picomatch#library-comparisons) where the libraries differ.

## Watch mode

When `ROLLUP_WATCH` is set, every file Sass loaded through the import system is added with `addWatchFile`, so edits to partials rebuild the bundle.

## Scope

This plugin compiles Sass and does nothing else. One `transform` hook calls `sass` `compileString`, one `generateBundle` hook emits the collected CSS as a single asset. There is no PostCSS step, no runtime `<style>` injection, no CSS modules, no prefix injection and no legacy Sass API path. Anything the compiler itself supports is available through `sassOptions`.

The two plugins people usually compare against cover a wider surface. `rollup-plugin-sass` adds a PostCSS `processor`, runtime `insert`, CSS modules and a legacy Sass API mode. `rollup-plugin-scss` adds a PostCSS `processor`, a global `prefix`, `failOnError` and `output` callbacks. Pick one of those when you need one of those features; pick this one when you want the compile step alone.

## Contributing

Issues and pull requests go to [vrtexe/rollup-plugin-sass-bundle](https://github.com/vrtexe/rollup-plugin-sass-bundle). The `example/` directory is a working TypeScript and Svelte project built through Rollup. Release history is on the [releases page](https://github.com/vrtexe/rollup-plugin-sass-bundle/releases).

## License

[MIT](https://github.com/vrtexe/rollup-plugin-sass-bundle/blob/main/LICENSE)
