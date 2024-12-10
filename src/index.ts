import path from "node:path";
import { createFilter, normalizePath } from 'vite';
import type { Plugin } from "vite";
import type { ConfigOptions } from "./typing";

const replaceImageUrl = (_opt: ConfigOptions): Plugin => {
  const options = Object.assign(
    {
      publicPath: "",
      sourceDir: "src/static",
      include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp'],
      exclude: [],
      verbose: false,
    },
    _opt
  );
  const filter = createFilter(options.include, options.exclude);
  return {
    name: 'vite-plugin-replace-image-url',
    enforce: 'pre',
    apply: 'build',
    load(id) {
      if (!filter(id)) return;
      const normalizedId = normalizePath(path.relative(options.sourceDir, id));
      // console.log('[ normalizedId ] >', normalizedId);
      const outputFileName = `${options.publicPath}/${normalizedId}`;
      if (options.verbose) {
        console.log('replace image url:', outputFileName);
      }
      return `export default "${outputFileName}"`;
    },
  };
};

export default replaceImageUrl;
