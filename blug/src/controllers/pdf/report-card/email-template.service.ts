import path from "node:path";
import pugService from "../../templating/pug.service.js"; 
import { settings } from "../../../config/settings.js";
import { imageService } from "../../image/image-service.js";
import { log } from "node:console";

export interface ParsedDirectives {
  directives: Record<string, string | string[]>; // e.g., { send_to: [...], client: "Excel College" }
  message: string; // cleaned body without directives
}

export interface IPugBaseLayout {
subject?: string
year?: number

// Branding
logoUrl?: string
companyNameShort?: string
companyNameFull?: string
appName?: string

// Footer / Contact
learnMoreUrl?: string
website?: string
email?: string
unsubscribeUrl?: string

}


/**
 * Data contract for the formal letter email template.
 * (Excludes variables provided by base-layout.pug)
 */
export interface IBusinessProposal {
  /** Organization name shown at top left */
  orgName: string;

  /** Organization physical address */
  address: string;

  /** Letter date (already formatted string) */
  date: string;

  /** Letter subject/title (also used as email subject externally) */
  subject: string;

  /** Recipient name (e.g., "Mr. Adewale") */
  contact: string;

  /** Main message body (plain text) */
  message: string;

  /** Signature name (e.g., CEO name) */
  ceo: string;

  /** Company full legal name shown under signature */
  companyNameFull: string;
}

/**
 * Data contract for the customer notification email template.
 * (Excludes variables provided by base-layout.pug)
 */
export interface ICustomerMessage {
  /** Customer first name or display name (used in "Hi, {customerName}") */
  customerName: string;

  /** Email subject / title shown in the header */
  subject: string;

  /** Main email message body (plain text) */
  message: string;

  /** Full company name displayed under signature */
  companyNameFull: string;
}



class EmailService {
  private templateDir: string;

  constructor() {
    //this.templateDir = "src/view/email/business-template/pug";
    this.templateDir = "src/view/email";
  }

  /* =========================
     RENDER EMAIL TEMPLATE
  ========================= */
  public async renderPreview(data: {
    subject: string;
    message: string;
  }): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      this.templateDir,
      //"business-template.pug"
      'customer-message.pug'
    );

    const logo = await imageService.listImages(
        'nexalearn', 'logo')

        let logoUrls: { thumb?: string | undefined; medium?: string | undefined; pdf?: string | undefined; } | null = null;

        for (const [key, value] of Object.entries(logo)) {
          if (key === 'nexalearn-logo-abidemi_ademola-1767972388956-ee184b9b904b') {
            console.log('[HEre is the found logo]', value)
            logoUrls = value
          }
        };

        

        //const body = (await this.getDummyEmailData()).message;
        //const { directives, message } = this.parseDirectives(data.message)
        //const emails = this.extractEmailsFromDirectives(data.message, ['send_to']);
        //const strings = this.extractStringDirectives(data.message, ['send_to']);
        //const message = this.stripDirectives(data.message);
        const { directives, message } = this.parseDirectives(data.message, ['send_to']);
        console.log('[directives and message]', {
          rawMessage: data.message,
          directives,
          message,
        });

        const cleanedData = { message, subject: data.subject };

    return pugService.renderFile(templatePath, {
      ...cleanedData,
      appName: "NXL-S App",
      year: new Date().getFullYear(),
     // logoUrl: 'http://127.0.0.1:3500' + '/uploads/nexalearn/logo/nexalearn-logo-abidemi_ademola-1767972388956-ee184b9b904b-pdf.png' || null, //logoUrls?.pdf || null,
      logoUrl: await imageService.readImageDataUrl(
        'nexalearn', 'logo', 'nexalearn-logo-abidemi_ademola-1767972388956-ee184b9b904b-pdf.png'
      ) || null, //logoUrls?.pdf || null,
      unsubscribeUrl: "#",

      companyNameFull: 'NexaLearn Systems and Technological Innovation',
      companyNameShort: 'NexaLearn Systems',
      ceo: 'Abidemi Tijani',
      website: 'nexalearnsystems.com',
      email: 'company@nexalearnsystems.com',
      learnMoreUrl: 'https://www.nexalearnsystems.com/automations/automation-services',

      //NEW
      //info of the client
      orgName: directives.client,
      customerName: directives.contact,
      address: 'Ikeja, Lagos',
      contact: directives.contact,
      date: new Date().toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })



    }, {
      pretty: true
    }, !settings.isDevMode); // no cache for preview mode
  }

  /* =========================
     DUMMY DATA (DEV ONLY)
  ========================= */
  public async getDummyEmailData() {
    return {
      subject: "Application for the Post of Software Engineer",
      message:
        `
        @send_to: abbby@5050.com
        @client: Excel College 
        @contact: Ade
        @field: Health

        Hello, I am writing to apply for the position of software engineer in your company. I believe my backend expertise and automation experience align with your needs.`,
    };
  }

   /* =========================
     EXTRA TOOLS
  ========================= */
/**
 * Extracts email addresses from specific directive lines inside an email body.
 *
 * A directive line must:
 *  - Start at the beginning of a line (ignoring leading spaces)
 *  - Start with @directiveName (case-insensitive)
 *  - Optionally include a colon after the directive name
 *  - Contain one or more email addresses after the directive
 *
 * ✔ Supported examples:
 *   @send_to john@gmail.com
 *   @client jane@company.com
 *   @send_to john@gmail.com, jane@company.com
 *   @send_to: john@gmail.com jane@company.com
 *
 * ✔ Multiple email addresses may be separated by:
 *   - Commas
 *   - Spaces
 *   - Combination of both
 *
 * ✔ Emails are:
 *   - Trimmed
 *   - Converted to lowercase
 *   - Validated using `this.isValidEmail`
 *   - Deduplicated (unique only)
 *
 * @param body - The raw email body text containing directives and message content
 * @param directives - List of directive names to extract (without the "@" symbol).
 *                     Example: ["send_to", "client_emails"]
 *
 * @returns An array of unique, normalized email addresses.
 *          Returns an empty array if:
 *            - body is empty
 *            - no directives are provided
 *            - no valid emails are found
 */
extractEmailsFromDirectives(
  body: string,
  directives: string[] = []
): string[] {

  // Guard clause:
  // If no body or no directives specified, nothing to extract.
  if (!body || !directives?.length) return [];

  // Use a Set to automatically remove duplicate emails.
  const results = new Set<string>();

  /**
   * Build a dynamic regex pattern that matches any of the provided directives.
   *
   * Example:
   *   directives = ["send_to", "client"]
   *   pattern becomes: "@send_to:?|@client:?"
   *
   * ":?" makes the colon optional.
   */
  const pattern = directives
    .map(d => `@${d}:?`)
    .join("|");

  /**
   * Final regex explanation:
   *
   * ^\s*              -> Start of line, allow leading whitespace
   * (pattern)         -> Match one of the directive names
   * \s+               -> At least one space after directive
   * (.+)              -> Capture the rest of the line (emails)
   * $                 -> End of line
   *
   * Flags:
   *  g  -> global (find all matches)
   *  i  -> case-insensitive
   *  m  -> multiline (apply ^ and $ per line)
   */
  const regex = new RegExp(`^\\s*(${pattern})\\s+(.+)$`, "gim");

  let match: RegExpExecArray | null;

  // Iterate over all matching directive lines
  while ((match = regex.exec(body)) !== null) {

    // Everything after the directive is considered raw email text
    const raw = match[2];

    /**
     * Split by:
     *   - Commas
     *   - Any whitespace
     *
     * Then:
     *   - Trim each value
     *   - Normalize to lowercase
     *   - Validate using isValidEmail()
     */
    const emails = raw
      .split(/[,\s]+/)
      .map(email => email.trim().toLowerCase())
      .filter(email => this.isValidEmail(email));

    // Add valid emails to the Set (automatically deduplicated)
    for (const email of emails) {
      results.add(email);
    }
  }

  // Convert Set back to array before returning
  return Array.from(results);
}

/**
 * Extracts non-email string directives from an email body.
 *
 * Supported syntax:
 *   @client: Excel College
 *   @contact: Mr Boss
 *   @business_name: NexaLearn Systems
 *   @field Health   (colon optional)
 *
 * ✔ Supports snake_case directive names (e.g. business_name)
 * ✔ Case-insensitive matching
 * ✔ Ignores directives specified as emailDirectives
 *
 * @param body - Raw email body text
 * @param excludeDirectives - Directive names to exclude (e.g. email directives like ["send_to"])
 *
 * @returns Record<string, string>
 *
 * @example
 * const body = `
 *   @client: Excel College
 *   @contact: Mr Boss
 *   @business_name: NexaLearn Systems
 * `;
 *
 * const result = extractStringDirectives(body);
 *
 * console.log(result);
 * // {
 * //   client: "Excel College",
 * //   contact: "Mr Boss",
 * //   business_name: "NexaLearn Systems"
 * // }
 */
extractStringDirectives(
  body: string,
  excludeDirectives: string[] = []
): Record<string, string> {
  if (!body) return {};

  const results: Record<string, string> = {};

  /**
   * Regex explanation:
   * ^\s*             -> allow leading spaces
   * @([a-zA-Z0-9_]+) -> directive name (supports snake_case)
   * :?               -> optional colon
   * \s+              -> at least one space
   * (.+)             -> capture value
   * $                -> end of line
   *
   * Flags:
   * g -> global (find all matches)
   * i -> case-insensitive
   * m -> multiline
   */
  const regex = /^\s*@([a-zA-Z0-9_]+):?\s+(.+)$/gim;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(body)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2].trim();

    // Skip excluded directives (like email directives)
    if (!excludeDirectives.map(d => d.toLowerCase()).includes(name)) {
      results[name] = value;
    }
  }

  return results;
}

/**
 * Removes all directive lines from an email body.
 *
 * Example lines removed:
 *   @send_to john@gmail.com
 *   @client: Excel College
 *   @contact: Mr Boss
 *
 * @param body - Raw email body text
 * @param directives - Optional array of directive names to remove (without @). Default: removes all @ directives.
 * @returns cleaned body without directive lines
 */
stripDirectives(body: string, directives?: string[]): string {
  if (!body) return body;

  const pattern = directives?.length
    ? directives.map(d => `@${d}:?`).join("|")  // only remove specific directives - optional colon
    : "@[a-zA-Z0-9_]+"; // remove all @ directives

  const regex = new RegExp(`^\\s*(${pattern}).*$`, "gim");

  return body
    .replace(regex, "") // remove directive lines
    .replace(/\n{3,}/g, "\n\n") // normalize multiple blank lines
    .trim();
}

/**
 * Parses an email body for both email-based and string-based directives,
 * and returns a clean message with the directives extracted.
 *
 * Email directives are lines like:
 *   @send_to john@example.com jane@company.com
 *
 * You can specify custom email directives, e.g. ["client_emails"].
 * Only directives listed in `emailDirectives` will be treated as email arrays.
 *
 * String directives are lines like:
 *   @client: Excel College
 *   @contact: Mr Boss
 *
 * Internally uses:
 *  - extractEmailsFromDirectives()
 *  - extractStringDirectives()
 *  - stripDirectives()
 *
 * @param body - Raw email body text containing directives and message
 * @param emailDirectives - Array of directive names that should be parsed as email lists (optional)
 *
 * @returns {
 *   directives: Record<string, string | string[]>;
 *   message: string;
 * }
 *
 * @example
 * const emailBody = `
 * @client_emails john@example.com jane@company.com
 * @client: Excel College
 * @contact: Mr Boss
 *
 * Hello, this is the main message.
 * It has multiple lines.
 * `;
 *
 * const result = parseDirectives(emailBody, ["client_emails"]);
 *
 * console.log(result.directives);
 * // {
 * //   client_emails: ["john@example.com", "jane@company.com"],
 * //   client: "Excel College",
 * //   contact: "Mr Boss"
 * // }
 *
 * console.log(result.message);
 * // "Hello, this is the main message.\nIt has multiple lines."
 */
parseDirectives(
  body: string,
  emailDirectives: string[] = []
): ParsedDirectives {

  if (!body) {
    return { directives: {}, message: "" };
  }

  const directives: Record<string, string | string[]> = {};

  // 1. Extract email directives
  for (const dir of emailDirectives ?? []) {
    const emails = this.extractEmailsFromDirectives(body, [dir]);
    if (emails.length) {
      directives[dir] = emails;
    }
  }

  // 2. Extract string directives (excluding email ones)
  const stringDirectives = this.extractStringDirectives(body, emailDirectives);

  for (const [key, value] of Object.entries(stringDirectives)) {
    // Only accept non-empty trimmed strings
    if (typeof value === "string" && value.trim().length > 0) {
      directives[key] = value.trim();
    }
  }

  // 3. Remove all directive lines
  const message = this.stripDirectives(body);

  return { directives, message };
}

/**
 * Basic RFC-safe email validation
 */
isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


}

export default new EmailService();
