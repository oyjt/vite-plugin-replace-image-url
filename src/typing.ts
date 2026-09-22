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
   * Picomatch patterns selecting SVG, PNG, JPEG, GIF, WebP and AVIF files
   * inside sourceDir.
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
