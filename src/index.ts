import path from "node:path";
import { Buffer } from "node:buffer";
import { createFilter, normalizePath } from "vite";
import type { Logger, Plugin } from "vite";
import type { ConfigOptions } from "./typing";

const pluginName = "vite-plugin-replace-image-url";
const markerPrefix = "https://vite-plugin-replace-image-url.invalid/";
const markerRE = new RegExp(`${markerPrefix}([A-Za-z0-9_-]+)`, "g");
const defaultInclude = ["**/*.{svg,png,jpg,jpeg,gif,webp,avif}"];
const styleRE = /\.(?:css|less|s[ac]ss|styl(?:us)?)$/;
const cssUrlRE = /url\(\s*(["']?)([^"')]+)\1\s*\)/g;
const htmlUrlRE = /\b(src|poster)\s*=\s*(["'])([^"']+)\2/g;

const parseRequest = (id: string): [string, URLSearchParams] => {
  const queryIndex = id.indexOf("?");
  const filePath = queryIndex === -1 ? id : id.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : id.slice(queryIndex + 1);
  return [filePath, new URLSearchParams(query)];
};

// Vite rewrites relative HTML/CSS URLs. Use absolute markers during its
// transforms, then restore the requested URL after the bundle is generated.
const toMarker = (url: string): string =>
  `${markerPrefix}${Buffer.from(url).toString("base64url")}`;

const finalizeMarkers = (source: string): string =>
  source.replace(markerRE, (_match, encoded: string) =>
    Buffer.from(encoded, "base64url").toString(),
  );

const replaceImageUrl = ({
  publicPath = "",
  sourceDir = "src/static",
  include = defaultInclude,
  exclude = [],
  verbose = false,
  silent = false,
}: ConfigOptions = {}): Plugin[] => {
  const filter = createFilter(include, exclude);
  const replacedImages = new Map<string, string>();
  const normalizedPublicPath = publicPath.replace(/\/+$/, "");
  let resolvedRoot: string;
  let resolvedSourceDir: string;
  let logger: Logger;

  const logError = (context: string, error: unknown): void => {
    if (silent) return;
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`[${pluginName}] ${context}: ${message}`);
  };

  const getOutputUrl = (filePath: string): string | null => {
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
    const outputUrl = `${normalizedPublicPath}/${normalizedPath}`;
    replacedImages.set(normalizedPath, outputUrl);
    return outputUrl;
  };

  const replaceSourceUrl = (url: string, importer: string): string | null => {
    if (
      url.startsWith("#") ||
      url.startsWith("//") ||
      /^[a-z][a-z\d+.-]*:/i.test(url) ||
      url.startsWith("var(")
    ) {
      return null;
    }

    const suffixIndex = url.search(/[?#]/);
    const pathname = suffixIndex === -1 ? url : url.slice(0, suffixIndex);
    const suffix = suffixIndex === -1 ? "" : url.slice(suffixIndex);
    const query = suffix.startsWith("?") ? suffix.slice(1).split("#", 1)[0] : "";
    const searchParams = new URLSearchParams(query);
    if (searchParams.has("raw") || searchParams.has("inline")) return null;

    let decodedPath: string;
    try {
      decodedPath = decodeURIComponent(pathname);
    } catch (error: unknown) {
      logError(`Failed to decode image URL ${url}`, error);
      return null;
    }

    const filePath = decodedPath.startsWith("/")
      ? path.resolve(resolvedRoot, `.${decodedPath}`)
      : path.resolve(path.dirname(importer), decodedPath);
    const outputUrl = getOutputUrl(filePath);
    return outputUrl === null ? null : `${outputUrl}${suffix}`;
  };

  const replacePlugin: Plugin = {
    name: pluginName,
    enforce: "pre",
    apply: "build",
    configResolved(config) {
      logger = config.logger;
      resolvedRoot = config.root;
      resolvedSourceDir = path.resolve(config.root, sourceDir);
    },
    buildStart() {
      replacedImages.clear();
    },
    load(id) {
      const [filePath, searchParams] = parseRequest(id);
      if (searchParams.has("raw") || searchParams.has("inline")) return null;

      const outputUrl = getOutputUrl(filePath);
      return outputUrl === null
        ? null
        : `export default ${JSON.stringify(outputUrl)}`;
    },
    transform(code, id) {
      const [filePath, searchParams] = parseRequest(id);
      if (!styleRE.test(filePath) && searchParams.get("type") !== "style") {
        return null;
      }

      let changed = false;
      const transformed = code.replace(cssUrlRE, (match, quote, url) => {
        const outputUrl = replaceSourceUrl(url, filePath);
        if (outputUrl === null) return match;
        changed = true;
        return `url(${quote}${toMarker(outputUrl)}${quote})`;
      });
      return changed ? { code: transformed, map: null } : null;
    },
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        return html.replace(htmlUrlRE, (match, attribute, quote, url) => {
          const outputUrl = replaceSourceUrl(url, context.filename);
          return outputUrl === null
            ? match
            : `${attribute}=${quote}${toMarker(outputUrl)}${quote}`;
        });
      },
    },
    buildEnd(error) {
      if (error || !verbose || silent) return;

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

  const finalizePlugin: Plugin = {
    name: `${pluginName}:finalize`,
    enforce: "post",
    apply: "build",
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === "asset" && typeof output.source === "string") {
          output.source = finalizeMarkers(output.source);
        }
      }
    },
  };

  return [replacePlugin, finalizePlugin];
};

export type { ConfigOptions } from "./typing";
export default replaceImageUrl;
