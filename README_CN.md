# vite-plugin-replace-image-url

![npm](https://img.shields.io/npm/v/vite-plugin-replace-image-url) ![license](https://img.shields.io/npm/l/vite-plugin-replace-image-url)

一个在构建阶段将指定源目录中的图片映射为外部 URL，并阻止这些图片进入构建产物的 Vite 插件。

[English](README.md) | [中文](README_CN.md)

## 安装

支持 Vite 3 及更高版本，要求 Node.js 18 或更高版本，仅支持 ESM。

```bash
pnpm add vite-plugin-replace-image-url -D
```

## 使用

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

例如，导入 `src/static/icons/logo.png` 时，生产构建结果会替换为：

```text
https://cdn.example.com/images/icons/logo.png
```

图片不会写入 Vite 构建产物。插件只在 `vite build` 时运行，不改变开发服务器行为。

## 配置项

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `publicPath` | `string` | `""` | 添加到图片相对路径前的路径或 URL |
| `sourceDir` | `string` | `"src/static"` | 图片源目录，相对 Vite `root` 解析 |
| `include` | `string \| string[]` | 常见 SVG、PNG、JPEG、GIF、WebP、AVIF 规则 | 包含的图片规则 |
| `exclude` | `string \| string[]` | `[]` | 排除的图片规则 |
| `verbose` | `boolean` | `false` | 输出已替换图片 URL 汇总 |

只有 `sourceDir` 内的文件会被替换。支持 `?url`，显式使用 `?raw` 或 `?inline` 时保留 Vite 原生行为。目标前缀支持 `./images`、`../images` 等相对路径；HTML `src`/`poster` 属性和 CSS `url()` 中的相对图片引用也会被替换。

```js
ReplaceImageUrl({
  publicPath: "https://cdn.example.com/images/",
  sourceDir: "src/static",
  include: ["**/*.{png,jpg,jpeg,webp,avif}"],
  exclude: ["**/logo.png"],
  verbose: true,
});
```

详细日志使用 Vite logger，格式如下：

```text
[vite-plugin-replace-image-url] Replaced 2 image URLs:
  - icons/menu.png -> https://cdn.example.com/images/icons/menu.png
  - banner/home.webp -> https://cdn.example.com/images/banner/home.webp
```

## 为什么需要 Vite 插件

如果所有构建资源只需要统一增加公共前缀，应优先使用 Vite 原生 `base`。本插件使用 Vite 最终解析的 `root`、logger、过滤工具、构建阶段控制和资源加载顺序，只替换指定图片并阻止其写入构建产物，因此属于 Vite 专用插件。

## 更新日志

版本变更与迁移说明见 [CHANGELOG.md](https://github.com/oyjt/vite-plugin-replace-image-url/blob/main/CHANGELOG.md)。

## 问题反馈

遇到问题或有功能建议，请提交 [GitHub Issue](https://github.com/oyjt/vite-plugin-replace-image-url/issues)。

## 使用许可

[MIT License](https://github.com/oyjt/vite-plugin-replace-image-url/blob/main/LICENSE)

Copyright (c) 2023-present cnpath
