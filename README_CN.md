# vite-plugin-replace-image-url

![npm](https://img.shields.io/npm/v/vite-plugin-replace-image-url) ![license](https://img.shields.io/npm/l/vite-plugin-replace-image-url)

一个替换图片url的vite插件。

[English](README.md) | [中文](README_CN.md)

## 内容目录

1.  [安装](#installation)
2.  [使用](#usage)
3.  [问题](#issues)
4.  [使用许可](#license)

### 安装

<a name="installation"></a>

```bash
  # npm
  npm i vite-plugin-replace-image-url -D

  # yarn
  yarn add vite-plugin-replace-image-url -D

  # pnpm
  pnpm add vite-plugin-replace-image-url -D
```

### 使用

<a name="usage"></a>

这是一个 vite 配置示例，说明了如何使用此插件

**vite.config.js**
```js
import replaceImageUrl from 'vite-plugin-replace-image-url';
export default {
  plugins: [replaceImageUrl()],
}
```
<h2 align="center">配置项</h2>

您可以将配置选项值传给`vite-plugin-replace-image-url`。
允许的值如下：

|名称|类型|默认值|描述|
|:--:|:--:|:-----:|:----------|
|**`publicPath`**|`{string}`|`''`|添加在文件名前面的路径|
|**`sourceDir`**|`{string}`|`'src/static'`|图片所在的路径|
|**`include`**|`{string \| Array<string>}`|`[]`|picomatch 模式或模式数组，用于指定插件应在构建文件中运行的文件|
|**`exclude`**|`{string \| Array<string>}`|`[]`|picomatch 模式或模式数组，用于指定插件应忽略的构建文件|
|**`verbose`**|`{boolean}`|`false`|将日志写入控制台|

这是一个示例 vite 配置，说明了如何使用这些选项

**vite.config.js**
```js
import replaceImageUrl from 'vite-plugin-replace-image-url';
export default {
  plugins: [replaceImageUrl(
    {
      publicPath: VITE_CDN_URL,
      sourceDir: path.resolve(__dirname, './src/static'),
      include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp'],
      exclude: ['logo.png'],
      verbose: true,
    }
  )],
}
```

### 问题

<a name="issues"></a>

如果您在使用过程中遇到问题，请点击这里 [问题反馈](https://github.com/oyjt/vite-plugin-replace-image-url/issues)

### 使用许可

<a name="license"></a>

[MIT License](https://github.com/oyjt/vite-plugin-replace-image-url/blob/master/LICENSE)

Copyright (c) 2023-present cnpath