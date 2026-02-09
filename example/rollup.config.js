import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import htmlGenerator from "@rollup/plugin-html";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { rm, mkdir } from "node:fs/promises";
import livereload from "rollup-plugin-livereload";
import sass from "../index.js";
import svelte from "rollup-plugin-svelte";
import { sveltePreprocess } from "svelte-preprocess";
import { resolve as resolvePath } from "node:path";
import { createIndexTemplate } from "./html.js";

/** @import  { type Plugin, type RollupOptions } from "rollup"; */
/** @import  { type RollupHtmlTemplateOptions } from "@rollup/plugin-html"; */

const production = !process.env.ROLLUP_WATCH;

/** @type {RollupOptions[]} */
export default [
  {
    input: "src/main.ts",
    output: {
      sourcemap: !production,
      format: "esm",
      name: "app",
      entryFileNames: production ? "bundle-[hash].js" : "bundle.js",
      assetFileNames: production ? "[name]-[hash].[ext]" : "[name].[ext]",
      dir: "dist/",
      inlineDynamicImports: true
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: { dev: !production }
      }),

      sass({
        bundleOptions: {
          enabled: true,
          name: "bundle.css"
        },
        sourceMap: true
      }),

      alias({
        entries: [
          {
            find: "src",
            replacement: resolvePath(import.meta.dirname, "src")
          }
        ]
      }),

      nodeResolve({
        browser: true,
        dedupe: ["svelte"]
      }),

      commonjs(),

      typescript({
        sourceMap: !production,
        inlineSources: !production,
        outDir: "dist/",
        exclude: ["dist"]
      }),

      cleanUpPreviousBuilds("dist/"),
      htmlGenerator({
        fileName: "index.html",
        template: createPopulatedIndexTemplate
      }),

      !production && livereload("public"),

      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  }
];

/**
 *
 * @param {string} dir
 * @returns  {Plugin}
 */
function cleanUpPreviousBuilds(dir) {
  return {
    name: "build-cleanup",
    buildStart: async () => {
      await rm(dir, { recursive: true, force: true });
      await mkdir(dir, { recursive: true });
    }
  };
}

/**
 * @param {RollupHtmlTemplateOptions} options
 * @returns {string}
 */
function createPopulatedIndexTemplate(options) {
  const { links, scripts } = createTemplateFields(options);
  return createIndexTemplate(links, scripts);
}

/**
 * @param {RollupHtmlTemplateOptions} options
 * @returns {({ scripts: string, links: string })}
 */
function createTemplateFields({ files, publicPath }) {
  const scripts = (files.js || [])
    .map(({ fileName }) => `<script type="module" src="${publicPath}${fileName}"></script>`)
    .join("\n    ");
  const links = (files.css || [])
    .map(({ fileName }) => `<link rel="stylesheet" href="${publicPath}${fileName}">`)
    .join("\n    ");

  return {
    scripts,
    links
  };
}
