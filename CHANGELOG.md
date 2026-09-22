# Changelog

## 2.0.0 (Unreleased / 未发布)

### Breaking changes

- Requires Node.js 18 or later and is now ESM only.
- Relative `sourceDir` paths are resolved from Vite's `root`.
- Only images inside `sourceDir` are replaced. Earlier versions could unintentionally match images elsewhere in the project.

### Other changes

- Added support for AVIF, explicit `?url` imports, relative output URLs, HTML `src`/`poster` attributes and CSS `url()` references.
- Preserved Vite behavior for `?raw` and `?inline` imports.
- Safely serializes generated JavaScript URLs.
- Uses Vite's logger and emits one verbose replacement summary per build.
- Exports the `ConfigOptions` type.
- Added real Vite build tests on Linux and Windows.
- Migrated npm publishing to trusted publishing with OIDC.

### 中文迁移说明

- 要求 Node.js 18 或更高版本，并改为仅支持 ESM。
- 相对 `sourceDir` 改为基于 Vite `root` 解析。
- 只替换 `sourceDir` 内的图片；旧版本可能误匹配项目其他目录的图片。
- 新增 AVIF、`?url`、相对目标 URL、HTML/CSS 相对图片引用、安全 URL 序列化、统一日志、类型导出、跨平台构建测试和 npm OIDC 发布。
