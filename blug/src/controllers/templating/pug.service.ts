// src/services/PugService.ts
import fs from "node:fs/promises";
import path from "node:path";
import pug, { LocalsObject } from "pug";


/**
 * A reusable Pug templating service.
 *
 * Features:
 * - Render Pug templates from file with dynamic data
 * - Optional pre-compilation and caching for performance
 * - Supports custom helpers/functions
 * - Suitable for ID cards, report cards, invoices, letters, etc.
 */
export class PugService {
  private templateCache = new Map<string, pug.compileTemplate>();

  /**
   * Render a Pug template from a file path
   * @param templateFile - Relative path to the Pug template file
   * @param data - The data object passed to the template
   * @param options - Optional Pug compile options
   * @param useCache - If true, the template will be cached in memory
   */
  public async renderFile(
    templateFile: string,
    data: LocalsObject = {},
    options: pug.Options = {},
    useCache = true
  ): Promise<string> {
    try {
      const absolutePath = path.isAbsolute(templateFile)
        ? templateFile
        : path.join(process.cwd(), templateFile);

      let templateFn = this.templateCache.get(absolutePath);

      if (!templateFn) {
        // Read the template file
        const pugSource = await fs.readFile(absolutePath, "utf-8");

        // Compile Pug to a reusable function
        templateFn = pug.compile(pugSource, {
          filename: absolutePath, // required for includes & extends
          pretty: true,           // produce readable HTML (optional)
          ...options,
        });

        // Cache the compiled template if enabled
        if (useCache) {
          this.templateCache.set(absolutePath, templateFn);
        }
      }

      // Render the template with data
      return templateFn(data);
    } catch (err) {
      console.error(`[PugService] Error rendering template: ${templateFile}`, err);
      throw err;
    }
  }

  /**
   * Clear the template cache
   * Useful if templates are updated at runtime
   */
  public clearCache() {
    this.templateCache.clear();
  }

  /**
   * Register helper functions for templates
   * Can be passed as part of the data object
   *
   * Example:
   *   pugService.renderFile('invoice.pug', { formatDate: (d) => ... });
   */
  public registerHelper<T extends Record<string, any>>(helpers: T) {
    return helpers; // Just return the helpers to merge with your data object
  }
}

// Singleton instance for general use
export default new PugService();

// Replace CompileOptions → pug.Options
// Use pug.TemplateFunction for the compiled function type.