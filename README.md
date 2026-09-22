# vite-plugin-replace-image-url

![npm](https://img.shields.io/npm/v/vite-plugin-replace-image-url) ![license](https://img.shields.io/npm/l/vite-plugin-replace-image-url)

A Vite plugin that maps imported images from one source directory to external URLs at build time without emitting those images.

[English](README.md) | [中文](README_CN.md)

## Installation

Supports Vite 3 and later. Requires Node.js 18 or later. This package is ESM only.

```bash
pnpm add vite-plugin-replace-image-url -D
```

## Usage

```js
import { defineConfig } from "vite";
import ReplaceImageUrl from "vite-plugin-replace-image-url";

export default defineConfig({
  plugins: [
    ReplaceImageUrl({
      publicPath: "https://cdn.example.com/images",
      sourceDir: "src/static",
    }),
  ],
});
```

An import such as `src/static/icons/logo.png` is replaced during a production build with:

```text
https://cdn.example.com/images/icons/logo.png
```

The image is not emitted into the Vite build output. Development server behavior is unchanged because the plugin only runs during `vite build`.

## Options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `publicPath` | `string` | `""` | Path or URL prepended to each image path |
| `sourceDir` | `string` | `"src/static"` | Image directory, resolved relative to Vite's `root` |
| `include` | `string \| string[]` | Common SVG, PNG, JPEG, GIF, WebP and AVIF patterns | Included image patterns |
| `exclude` | `string \| string[]` | `[]` | Excluded image patterns |
| `verbose` | `boolean` | `false` | Log a summary of replaced image URLs |
| `silent` | `boolean` | `false` | Disable all plugin logs, including errors |

Only files inside `sourceDir` can be replaced. `?url` imports are supported. Explicit `?raw` and `?inline` imports retain Vite's native behavior. Relative output prefixes such as `./images` and `../images` are supported. Relative image references in HTML `src`/`poster` attributes and CSS `url()` values are also replaced, using either a relative output prefix or an absolute CDN URL from `publicPath`.

```js
ReplaceImageUrl({
  publicPath: "https://cdn.example.com/images/",
  sourceDir: "src/static",
  include: ["**/*.{png,jpg,jpeg,webp,avif}"],
  exclude: ["**/logo.png"],
  verbose: true,
});
```

`silent` takes precedence over `verbose` and suppresses plugin error logs as well.

Verbose output follows Vite's logger:

```text
[vite-plugin-replace-image-url] Replaced 2 image URLs:
  - icons/menu.png -> https://cdn.example.com/images/icons/menu.png
  - banner/home.webp -> https://cdn.example.com/images/banner/home.webp
```

## Why a Vite plugin?

Vite's `base` option is the simpler choice when every built asset should use the same public prefix. This plugin is Vite-specific because it uses Vite's resolved `root`, logger, filtering utilities, build-only application and pre-enforced asset loading to replace only selected imported images while preventing their emission.

## Changelog

See [CHANGELOG.md](https://github.com/oyjt/vite-plugin-replace-image-url/blob/main/CHANGELOG.md).

## Issues

Report bugs or request features in [GitHub Issues](https://github.com/oyjt/vite-plugin-replace-image-url/issues).

## License

[MIT License](https://github.com/oyjt/vite-plugin-replace-image-url/blob/main/LICENSE)

Copyright (c) 2023-present cnpath
