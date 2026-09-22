import path from "node:path";
import { createFilter, normalizePath } from "vite";
import type { Logger, Plugin } from "vite";
import type { ConfigOptions } from "./typing";

const pluginName = "vite-plugin-replace-image-url";
const defaultInclude = ["**/*.{svg,png,jpg,jpeg,gif,webp,avif}"];

const replaceImageUrl = ({
  publicPath = "",
  sourceDir = "src/static",
  include = defaultInclude,
  exclude = [],
  verbose = false,
}: ConfigOptions = {}): Plugin => {
  const filter = createFilter(include, exclude);
  const replacedImages = new Map<string, string>();
  let resolvedSourceDir: string;
  let logger: Logger;

  return {
    name: pluginName,
    enforce: "pre",
    apply: "build",
    configResolved(config) {
      logger = config.logger;
      resolvedSourceDir = path.resolve(config.root, sourceDir);
    },
    buildStart() {
      replacedImages.clear();
    },
    load(id) {
      const queryIndex = id.indexOf("?");
      const filePath = queryIndex === -1 ? id : id.slice(0, queryIndex);
      const query = queryIndex === -1 ? "" : id.slice(queryIndex + 1);
      const searchParams = new URLSearchParams(query);

      if (searchParams.has("raw") || searchParams.has("inline")) return null;
      if (!filter(normalizePath(filePath))) return null;

      const relativePath = path.relative(resolvedSourceDir, filePath);
      if (
        relativePath === "" ||
        relativePath.startsWith(`..${path.sep}`) ||
        relativePath === ".." ||
        path.isAbsolute(relativePath)
      ) {
        return null;
      }

      const normalizedPath = normalizePath(relativePath);
      const normalizedPublicPath = publicPath.replace(/\/+$/, "");
      const outputUrl = `${normalizedPublicPath}/${normalizedPath}`;

      replacedImages.set(normalizedPath, outputUrl);
      return `export default ${JSON.stringify(outputUrl)}`;
    },
    buildEnd(error) {
      if (error || !verbose) return;

      if (replacedImages.size === 0) {
        logger.info(`[${pluginName}] No matching images found.`);
        return;
      }

      const label = replacedImages.size === 1 ? "image URL" : "image URLs";
      const details = [...replacedImages]
        .map(([source, target]) => `  - ${source} -> ${target}`)
        .join("\n");
      logger.info(
        `[${pluginName}] Replaced ${replacedImages.size} ${label}:\n${details}`,
      );
    },
  };
};

export type { ConfigOptions } from "./typing";
export default replaceImageUrl;
