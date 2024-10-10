import { createFilter } from '@rollup/pluginutils';
import { dirname } from 'node:path';

/**
 * @typedef {Object} SassPluginOptions
 * @property {Parameters<CreateFilter>[0]} [include]
 * @property {Parameters<CreateFilter>[1]} [exclude]
 * @property {string[]} [loadPaths]
 * @property {SassCompiler} [runtime]
 * @property {boolean} [sourceMap]
 * @property {SassOptions} [sassOptions]
 * @property {BundleOptions} [bundleOptions]
 */

/**
 * @typedef {Object} BundleOptions
 * @property {boolean} [enabled]
 * @property {Parameters<CreateFilter>[0]} [include]
 * @property {Parameters<CreateFilter>[1]} [exclude]
 * @property {string} [name]
 * @property {string} [fileName]
 */

/** @typedef {({ bundle: { [id: string]: string } })} SassPluginState */

/** @typedef {typeof createFilter} CreateFilter */

/** @typedef {Pick<import('sass').Compiler, 'compileString'>} SassCompiler */
/** @typedef {import('sass').StringOptions<'sync'>} SassOptions  */

/**
 * @param {SassPluginOptions} options
 * @returns {import('rollup').Plugin}
 */
export default async function(options = {}) {
  /** @type {SassPluginState} */
  const state = {
    bundle: {}
  };

  /** @type {SassCompiler} */
  const runtime = options.runtime || (await import('sass'));

  const bundleOptions = options.bundleOptions;

  const defaultInclude = ['**/*.scss', '**/*.sass'];
  const defaultBundleInclude = ['**/*.css', ...defaultInclude];

  const filter = createFilter(options.include || defaultInclude, options.exclude);
  const bundleFilter = bundleOptions?.enabled
    ? createFilter(bundleOptions?.include || defaultBundleInclude, bundleOptions?.exclude)
    : undefined;

  /**
   * @param {string} code
   * @param {string} id
   * @returns
   */
  function bundleFile(code, id) {
    if (!bundleOptions?.enabled || !bundleFilter?.(id)) {
      return;
    }

    state.bundle[id] = code;
    return '';
  }

  return {
    name: 'sass',
    transform(code, id) {
      if (!filter(id)) {
        return bundleFile(code, id);
      }

      const paths = [dirname(id), process.cwd()];

      const result = runtime.compileString(code, {
        loadPaths: [...paths, ...(options.loadPaths || [])],
        style: 'compressed',
        sourceMap: options.sourceMap,
        ...(options.sassOptions || {})
      });

      bundleFile(result.css, id);

      if (process.env.ROLLUP_WATCH) {
        for (const loadedUrl of result.loadedUrls) {
          this.addWatchFile(loadedUrl.filePath);
        }
      }

      if (bundleOptions?.enabled) {
        return '';
      }

      return {
        code: result.css,
        map: result.sourceMap
      };
    },
    generateBundle(rollupOptions, bundle, isWrite) {
      if (!isWrite || !bundleOptions?.enabled) {
        return;
      }

      const source = Object.values(state.bundle).join('');
      this.emitFile({
        type: 'asset',
        source: source,
        name: bundleOptions.name,
        fileName: bundleOptions.fileName
      });

      return {
        type: 'asset',
        source: source
      };
    }
  };
}
