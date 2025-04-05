import path from "node:path";
import { createFilter, normalizePath } from 'vite';
import type { Plugin } from "vite";
import type { ConfigOptions } from "./typing";

const defaultOptions: ConfigOptions = {
  publicPath: "",
  sourceDir: "src/static",
  include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp'],
  exclude: [],
  verbose: false,
};

const replaceImageUrl = (_opt: Partial<ConfigOptions> = {}): Plugin => {
  const options = { ...defaultOptions, ..._opt };
  const filter = createFilter(options.include, options.exclude);
  return {
    name: 'vite-plugin-replace-image-url',
    enforce: 'pre',
    apply: 'build',
    load(id) {
      if (!filter(id)) return null;

      try {
        const normalizedId = normalizePath(path.relative(options.sourceDir, id));
        // Avoid double slashes in the path
        const publicPath = options.publicPath.endsWith('/') 
          ? options.publicPath.slice(0, -1) 
          : options.publicPath;
        const outputFileName = `${publicPath}/${normalizedId}`;

        if (options.verbose) {
          console.log('replace image url:', outputFileName);
        }
        return `export default "${outputFileName}"`;
      } catch (error) {
        console.error(`Error processing file: ${id}`, error);
        return null;
      }
    },
  };
};

export default replaceImageUrl;
