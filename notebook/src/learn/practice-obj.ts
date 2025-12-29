import { validators } from "../utils/validator.js";

export const filterConditions = {
    page: '1',
    limit: '10',
    isSent: 'false',
    name: 'abidemi',
}


export function formatFilterMutate(filters: Record<string, any>) {
      for (const [key, value] of Object.entries(filters)) {
        if (!isNaN(Number(value))) {
            filters[key] = Number(filters[key])
        }
        const isBool = value === 'true' || value === 'false';
        if (isBool) {
            filters[key] = validators.validateBoolean(filters[key])
        }
      }
      return filters;   
}

//I want to know why this does't work
// export function formatFilterClone(filters: Record<string, any>) {
//     const cloned = filters;
//     for (const [key, value] of Object.values(cloned)) {
//         if (!isNaN(Number(cloned[key]))) {
//             cloned[key] = Number(cloned[key])
//         }
//         const isBool = value === 'true' || value === 'false'
//         if (isBool) {
//             cloned[key] = validators.validateBoolean(cloned[key])
//         }
//     }
//     return cloned
// }


// const allowedMimeType = ['.pdf', '.png', '.jpg', '.txt', '.doc', '.csv'];
// const filenames = ['invoice.pdf', 'book-one.mp4']

// export const getFileMime = (file: string) => {
//     const i = file.indexOf('.', -1)
//     console.log('[TEST] INDEX', i)
// const mime = file.slice(i)
// return mime
// }
// const unacceptedFiles = filenames?.filter(file => !allowedMimeType.includes(file))


export const validateAndSanitizeBoolean = (value: string | number | boolean): boolean => {
   // Handle undefined/null/empty string
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const sanitized = value.trim().toLowerCase();
    if (sanitized === 'true') return true;
    if (sanitized === 'false') return false;
    
    // Handle numeric strings
    if (sanitized === '1') return true;
    if (sanitized === '0') return false;
    
    // Handle 'yes'/'no' 
    if (sanitized === 'yes' || sanitized === 'y') return true;
    if (sanitized === 'no' || sanitized === 'n') return false;
  }

  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  throw new Error(
    'Invalid input: expected boolean, "true", "false", 1, or 0.'
  );

};

export function validateBooleanOptions(value: Record<string, boolean|string|number>): Record<string, boolean> {
    const valueArr = Object.keys(value);
    const valueV = Object.values(value)
    console.log('keys steps', valueArr)
    console.log('value steps', valueV)
  if (!value || valueArr.length === 0) return {};

  let booleanOptions: Record<string, boolean> = {};
  for (const [k, v] of valueArr) {
    console.log('value in array', v)
    // Handle undefined/null by defaulting to false
    if (v === undefined || v === null) {
      booleanOptions.k = false;
      continue;
    }
    
    // If it's already a boolean, use it directly
    if (typeof v === 'boolean') {
      booleanOptions.k = v;
      continue;
    }
    
    // Handle strings and numbers
    try {
      const bool = validateAndSanitizeBoolean(v);
      booleanOptions.k = bool;
    } catch (error) {
      // If validation fails, default to false
      booleanOptions.k = false;
    }
  }
  //return value as Record<string, boolean>;
  return booleanOptions
}

export function stringManipulation(s: string) {
   const pos = s.split(' ').slice(0,2) //.charAt(2)
   
   return {
    value: pos,
    valueLen: pos.length
   }
}