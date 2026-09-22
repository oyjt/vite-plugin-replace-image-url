export interface ConfigOptions {
  /**
   * A path or URL added before each image path.
   *
   * @default ""
   */
  publicPath?: string;
  /**
   * Directory containing the images to replace. Relative paths are resolved
   * from Vite's root.
   *
   * @default "src/static"
   */
  sourceDir?: string;
  /**
   * Picomatch patterns selecting image files inside sourceDir.
   *
   * @default ["**/*.{svg,png,jpg,jpeg,gif,webp,avif}"]
   */
  include?: string | string[];
  /**
   * Picomatch patterns excluding image files.
   *
   * @default []
   */
  exclude?: string | string[];
  /**
   * Log a summary of replaced image URLs.
   *
   * @default false
   */
  verbose?: boolean;
}
