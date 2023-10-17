export interface ConfigOptions {
  /**
   * A path which added in front of filenames.
   * 
   * default: (empty string)
   */
  publicPath: string;
  /**
   * The path where the picture is located.
   * 
   * default: "src/static"
   */
  sourceDir: string;
  /**
   * A picomatch pattern, or array of patterns, which specifies the files in the build the plugin should operate on.
   * 
   * ['**\/*.svg', '**\/*.png', '**\/*.jp(e)?g', '**\/*.gif', '**\/*.webp']
   */
  include?: string | string[];
  /**
   * A picomatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. 
   * 
   * default: []
   */
  exclude?: string | string[];
  /**
   * Write logs to console
   *
   * default: false
   */
  verbose?: boolean;
}