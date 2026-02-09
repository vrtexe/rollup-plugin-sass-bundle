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
 * @returns {Promise<import('rollup').Plugin>}
 */
export default function _default(options?: SassPluginOptions): Promise<import("rollup").Plugin>;
export type SassPluginOptions = {
    include?: Parameters<CreateFilter>[0];
    exclude?: Parameters<CreateFilter>[1];
    loadPaths?: string[] | undefined;
    runtime?: Pick<import("sass").Compiler, "compileString"> | undefined;
    sourceMap?: boolean | undefined;
    sassOptions?: import("sass").StringOptions<"sync"> | undefined;
    bundleOptions?: BundleOptions | undefined;
};
export type BundleOptions = {
    enabled?: boolean | undefined;
    include?: Parameters<CreateFilter>[0];
    exclude?: Parameters<CreateFilter>[1];
    name?: string | undefined;
    fileName?: string | undefined;
};
export type SassPluginState = ({
    bundle: {
        [id: string]: string;
    };
});
export type CreateFilter = typeof createFilter;
export type SassCompiler = Pick<import("sass").Compiler, "compileString">;
export type SassOptions = import("sass").StringOptions<"sync">;
import { createFilter } from '@rollup/pluginutils';
//# sourceMappingURL=index.d.ts.map