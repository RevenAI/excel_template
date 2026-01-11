// src/services/templating.service.ts
import Handlebars from "handlebars";
import { DateTime } from "luxon";
import { IGradeBand, StudentGrades } from "../report/types.js";

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
 *   import templatingService from './services/templating.service';
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
   *
   * - formatDate: formats dates using Luxon
   * - equals: conditional rendering based on strict equality
   * - substring: returns a substring of a string
   * - default: provides a fallback value for null or undefined
   */
  private registerDefaultHelpers() {
    /**
     * Format a date using Luxon.
     *
     * Supports:
     * - ISO strings
     * - JS Date objects
     *
     * Example:
     *   {{formatDate date "dd LLL yyyy"}}
     */
    Handlebars.registerHelper(
      "formatDate",
      (date: string | Date, format: string) => {
        if (!date) return "";

        let dt: DateTime;

        if (date instanceof Date) {
          dt = DateTime.fromJSDate(date);
        } else {
          dt = DateTime.fromISO(date);
        }

        if (!dt.isValid) return "";

        return dt.toFormat(format);
      }
    );

    /**
     * Check strict equality (===)
     *
     * Example:
     *   {{#equals grade "A1"}}Excellent{{/equals}}
     */
    Handlebars.registerHelper(
      "equals",
      (a: StudentGrades, b: StudentGrades, options: Handlebars.HelperOptions) => {
        return a === b ? options.fn(this) : options.inverse(this);
      }
    );

    /**
 * Get color code for a grade from grade interpretation config
 *
 * Usage:
 *   {{getGradeColor "A1" gradeInterpretation}}
 */
Handlebars.registerHelper(
  "getGradeColor",
  (
    grade: StudentGrades | string,
    gradeBands: readonly IGradeBand[]
  ): string => {
    if (!grade || !Array.isArray(gradeBands)) {
      return "";
    }

    const band = gradeBands.find(
      (b) => b.grade === grade
    );

    return band?.colorCode ?? "";
  }
);

    /**
     * Substring helper
     *
     * Example:
     *   {{substring studentName 0 10}}
     */
    Handlebars.registerHelper(
      "substring",
      (str: string, start: number, end: number) => {
        if (!str) return "";
        return str.substring(start, end);
      }
    );

        // Get initials from a full name
    Handlebars.registerHelper("getInitials", (fullName: string) => {
      if (!fullName) return "";
      return fullName
        .split(" ")
        .map(word => word[0].toUpperCase())
        .join("");
    });

    // Calculate attendance percentage
    Handlebars.registerHelper(
      "calculateAttendancePercentage",
      (present: number, total: number) => {
        if (!total || total === 0) return "0";
        return ((present / total) * 100).toFixed(0);
      }
    );

    // Calculate average score
    Handlebars.registerHelper(
      "calculateAverage",
      (totalObtained: number, numSubjects: number) => {
        if (!numSubjects || numSubjects === 0) return "0";
        return (totalObtained / numSubjects).toFixed(2);
      }
    );

    /**
 * Less than comparison helper (<)
 *
 * Example:
 *   {{#if (lt this.scores.length 3)}}
 *     Show something if scores less than 3
 *   {{/if}}
 */
Handlebars.registerHelper("lt", (a: number, b: number): boolean => {
  return a < b;
});

  /**
   * Subtraction helper (a - b)
   *
   * Example:
   *   {{sub 3 this.scores.length}}
   */
  // Handlebars.registerHelper("sub", (a: number, b: number): number => {
  //   return a - b;
  // });

  /**
 * Subtract helper (a - b)
 * 
 * Used in: {{subtract 100 studentAttendancePercentagePerTerm.firstTermStudentAttendancePercentage}}
 * 
 * Example:
 *   {{subtract 100 85}} => 15
 */
Handlebars.registerHelper(
  "sub",
  (a: number, b: number): number => {
    if (typeof a !== "number" || typeof b !== "number") {
      return 0;
    }
    return a - b;
  }
);

  /**
   * Repeat helper - repeats content n times
   *
   * Example:
   *   {{#repeat (sub 3 this.scores.length)}}
   *     <div class="score-item">-/-</div>
   *   {{/repeat}}
   */
  Handlebars.registerHelper(
    "repeat",
    (n: number, options: Handlebars.HelperOptions) => {
      if (n <= 0) return "";
      
      let result = "";
      for (let i = 0; i < n; i++) {
        result += options.fn(this);
      }
      return result;
    }
  );

  Handlebars.registerHelper(
  "calculateAttendanceAverage",
  (...args: unknown[]) => {
    // Last argument is Handlebars options object
    const values = args
      .slice(0, -1)
      .filter(v => typeof v === "number" && v > 0) as number[];

    if (values.length === 0) return "0";

    const average =
      values.reduce((sum, val) => sum + val, 0) / values.length;

    return average.toFixed(2);
  }
);


    /**
     * Default value fallback
     *
     * Example:
     *   {{default remark "No remark"}}
     */
    Handlebars.registerHelper(
      "default",
      (value: number, fallback: string) => {
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
