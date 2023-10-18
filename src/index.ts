import path from "node:path";
import { createFilter } from '@rollup/pluginutils';
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
      if (!filter(id)) return null;
      const name = path.basename(id);
      const relativeDir = path.relative(options.sourceDir, path.dirname(id));
      const outputFileName = `${options.publicPath}/${relativeDir}/${name}`;
      if (options.verbose) {
        console.log('replace image url:', outputFileName);
      }
      return `export default "${outputFileName}"`;
    },
  };
};

export default replaceImageUrl;
