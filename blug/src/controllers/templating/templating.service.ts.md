// src/services/TemplatingService.ts
// import Handlebars from "handlebars";
// import moment from "moment";

/**
 * TemplatingService
 * ----------------
 * Singleton service for rendering HTML templates using Handlebars.
 * 
 * Features:
 * - Simple variable replacement: {{key}}
 * - Conditional blocks: {{#if key}} ... {{else}} ... {{/if}}
 * - Loops: {{#each array}} ... {{/each}}
 * - Nested objects: {{user.name}}
 * - Helpers for date formatting, equality checks, substring, and defaults
 * 
 * Usage:
 *   import templatingService from './services/TemplatingService';
 *   const html = templatingService.render(templateString, data);
 */
class TemplatingService {
  /** Singleton instance */
  private static instance: TemplatingService;

  /**
   * Private constructor to enforce singleton pattern.
   * Registers the default Handlebars helpers.
   */
  private constructor() {
    this.registerDefaultHelpers();
  }

  /**
   * Returns the singleton instance of TemplatingService.
   * Creates the instance if it does not exist.
   */
  public static getInstance(): TemplatingService {
    if (!TemplatingService.instance) {
      TemplatingService.instance = new TemplatingService();
    }
    return TemplatingService.instance;
  }

  /**
   * Registers the default Handlebars helpers:
   * - formatDate: formats dates using Moment.js
   * - equals: conditional rendering based on equality
   * - substring: returns a substring of a string
   * - default: provides a fallback value for null/undefined
   */
  private registerDefaultHelpers() {
    // Format a date
    Handlebars.registerHelper(
      "formatDate",
      (date: string | Date, format: string) => {
        if (!date) return "";
        return moment(date).format(format);
      }
    );

    // Check equality
    Handlebars.registerHelper(
      "equals",
      (a: any, b: any, options: any) => {
        return a === b ? options.fn(this) : options.inverse(this);
      }
    );

    // Substring helper
    Handlebars.registerHelper(
      "substring",
      (str: string, start: number, end: number) => {
        if (!str) return "";
        return str.substring(start, end);
      }
    );

    // Default value fallback
    Handlebars.registerHelper(
      "default",
      (value: any, fallback: string) => {
        return value ?? fallback;
      }
    );
  }

  /**
   * Register a custom Handlebars helper dynamically.
   * Can be used to extend functionality beyond defaults.
   * 
   * @param name - Name of the helper
   * @param fn - Helper function
   */
  public registerHelper(name: string, fn: Handlebars.HelperDelegate) {
    Handlebars.registerHelper(name, fn);
  }

  /**
   * Renders an HTML template string with the provided data.
   * 
   * @param template - Handlebars template string
   * @param data - Data object to populate template variables
   * @returns Rendered HTML string
   */
  public render(template: string, data: Record<string, any>): string {
    const templateFn = Handlebars.compile(template);
    return templateFn(data);
  }
}

// Export singleton instance
export default TemplatingService.getInstance();
