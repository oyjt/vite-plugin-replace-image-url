# vite-plugin-replace-image-url

![npm](https://img.shields.io/npm/v/vite-plugin-replace-image-url) ![license](https://img.shields.io/npm/l/vite-plugin-replace-image-url)

A vite plugin which replace images url.

[English](README.md) | [中文](README_CN.md)

## Table of Contents

1.  [Installation](#installation)
2.  [Usage](#usage)
3.  [Issues](#issues)
4.  [License](#license)

### Installation

<a name="installation"></a>

```bash
  # npm
  npm i vite-plugin-replace-image-url -D

  # yarn
  yarn add vite-plugin-replace-image-url -D

  # pnpm
  pnpm add vite-plugin-replace-image-url -D
```

### Usage

<a name="usage"></a>

Here's an example vite config illustrating how to use this plugin

**vite.config.js**
```js
import replaceImageUrl from 'vite-plugin-replace-image-url';
export default {
  plugins: [replaceImageUrl()],
}
```
<h2 align="center">Options</h2>

You can pass a hash of configuration options to `vite-plugin-replace-image-url`.
Allowed values are as follows:

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`publicPath`**|`{string}`|`''`|A path which added in front of filenames.|
|**`sourceDir`**|`{string}`|`'src/static'`|The path where the picture is located.|
|**`include`**|`{string \| Array<string>}`|`['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp']`|A picomatch pattern, or array of patterns, which specifies the files in the build the plugin should operate on.|
|**`exclude`**|`{string \| Array<string>}`|`[]`|A picomatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore.|
|**`verbose`**|`{boolean}`|`false`|Write logs to console.|

Here's an example vite config illustrating how to use these options

**vite.config.js**
```js
import replaceImageUrl from 'vite-plugin-replace-image-url';
export default {
  plugins: [replaceImageUrl(
    {
      publicPath: VITE_CDN_URL,
      sourceDir: path.resolve(__dirname, './src/static'),
      include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp'],
      exclude: ['**/logo.png'],
      verbose: true,
    }
  )],
}
```

### Issues

<a name="issues"></a>

If you encounter some problems during use, please click here [Issue Report](https://github.com/oyjt/vite-plugin-replace-image-url/issues)

### License

<a name="license"></a>

[MIT License](https://github.com/oyjt/vite-plugin-replace-image-url/blob/master/LICENSE)

Copyright (c) 2023-present cnpath