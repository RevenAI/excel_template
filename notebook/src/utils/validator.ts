
class Vadators {
    
/**
 * @description Validates a value and attempts to convert it to a boolean.
 *              Accepts boolean, string representations of booleans ("true"/"false"), or undefined.
 *              Returns `true`, `false`, or `undefined` for invalid/falsy values.
 *
 * @param value - The value to validate and convert.
 * @returns {boolean | undefined} Converted boolean or undefined if input is falsy/invalid.
 *
 * @throws {Error} If the value is not a string, boolean, or undefined.
 *
 * @example
 * Validator.validateBoolean("true"); // true
 * Validator.validateBoolean(false);  // false
 * Validator.validateBoolean("nope"); // undefined
 */
public validateBoolean(value: string | boolean | undefined): boolean | undefined {
  // Return undefined for falsy values (undefined, null, empty string)
  if (value === undefined || value === null || value === '') return undefined;

  // Ensure type is string or boolean
  if (typeof value !== 'string' && typeof value !== 'boolean') {
    throw new Error('Value must be of type string or boolean');
  }

  // If already boolean, return as-is
  if (typeof value === 'boolean') return value;

  // Convert string representations to boolean
  switch (value.toLowerCase().trim()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
}

}

export const validators = new Vadators();