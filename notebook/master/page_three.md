### Palindrome definition

A palindrome is something that reads the same forward and backward after optional normalization (like ignoring case, spaces, or punctuation). Common examples: words (“level”), phrases (“nurses run”), numbers (121), or sequences.

---

### What to decide before checking

- **Scope:** Are you checking strings, numbers, or arrays?
- **Normalization:** Will you ignore case, spaces, punctuation, diacritics?
- **Locale:** Should comparisons use Unicode-aware rules?
- **Performance:** Do you need linear time and O(1) extra space?

---

### String palindrome checks in TypeScript

#### Helper: normalization

```ts
// Choose the normalization you need.
// This version lowercases, removes non-alphanumerics, and normalizes Unicode.
export function normalize(input: string): string {
  return input
    .normalize("NFKD")                  // split diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");         // keep only ASCII letters/digits
}
```

#### Method 1: two-pointer (efficient, O(n), O(1) extra)

```ts
export function isPalindromeTwoPointer(raw: string): boolean {
  const s = normalize(raw);
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++; j--;
  }
  return true;
}
```

#### Method 2: reverse and compare (simple, O(n), O(n) extra)

```ts
export function isPalindromeReverse(raw: string): boolean {
  const s = normalize(raw);
  const rev = s.split("").reverse().join("");
  return s === rev;
}
```

#### Method 3: generator-friendly stream check (no full copy)

```ts
// If you receive characters incrementally, you can buffer once and two-pointer scan.
// For truly streaming without full buffer, you'd need a deque or rolling storage.
export function isPalindromeFromChars(chars: Iterable<string>): boolean {
  const s = normalize([...chars].join(""));
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++; j--;
  }
  return true;
}
```

---

### Number palindrome checks in TypeScript

#### Method 1: numeric reverse (no string conversion)

```ts
export function isNumericPalindrome(x: number): boolean {
  if (x < 0) return false;                // negative sign breaks symmetry
  if (x % 10 === 0 && x !== 0) return false; // trailing zero cannot be pal unless 0

  let reverted = 0;
  // Build half of the reversed number
  while (x > reverted) {
    reverted = reverted * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  // Even length: x === reverted
  // Odd length: x === Math.floor(reverted / 10) (middle digit ignored)
  return x === reverted || x === Math.floor(reverted / 10);
}
```

#### Method 2: convert to string (simpler, less numeric purity)

```ts
export function isNumericPalindromeString(x: number): boolean {
  const s = String(x);
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++; j--;
  }
  return true;
}
```

---

### Edge cases and tips

- **Unicode:** If you need full Unicode letters (beyond ASCII), replace the regex with a Unicode-aware one:  
  `s.replace(/[^\p{L}\p{N}]/gu, "")` and keep `.normalize("NFKD").toLowerCase()`.
- **Phrases:** Decide whether to ignore spaces/punctuation. The `normalize` helper handles that.
- **Locale case rules:** For special casing (e.g., Turkish), consider `toLocaleLowerCase("tr")`.
- **Arrays:** Palindrome logic applies to any sequence; compare symmetric elements with two pointers.
- **Performance:** Two-pointer avoids allocating a reversed copy, which helps on large inputs.

---

### Quick usage and tests

```ts
// Strings
console.log(isPalindromeTwoPointer("Level"));             // true
console.log(isPalindromeTwoPointer("nurses run"));        // true
console.log(isPalindromeTwoPointer("A man, a plan, a canal: Panama")); // true
console.log(isPalindromeTwoPointer("hello"));             // false

// Numbers
console.log(isNumericPalindrome(121));                    // true
console.log(isNumericPalindrome(-121));                   // false
console.log(isNumericPalindrome(10));                     // false
console.log(isNumericPalindromeString(1331));             // true
```

#######################################################################################

Got it 👍 — let’s break down the **time complexity** of the palindrome checks we discussed in TypeScript.

---

### 1. Two-pointer method
```ts
export function isPalindromeTwoPointer(raw: string): boolean {
  const s = normalize(raw);
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++; j--;
  }
  return true;
}
```

- **Normalization step:** `normalize` runs through the string once → **O(n)**.
- **Two-pointer scan:** Each character is checked at most once → **O(n)**.
- **Total time complexity:** **O(n)**  
- **Space complexity:** **O(1)** extra (ignoring the normalized copy).

---

### 2. Reverse-and-compare method
```ts
export function isPalindromeReverse(raw: string): boolean {
  const s = normalize(raw);
  const rev = s.split("").reverse().join("");
  return s === rev;
}
```

- **Normalization:** **O(n)**.
- **Split + reverse + join:** Each step traverses the string → **O(n)**.
- **Comparison:** **O(n)**.
- **Total time complexity:** **O(n)**  
- **Space complexity:** **O(n)** (because of the reversed copy).

---

### 3. Numeric palindrome (without string conversion)
```ts
export function isNumericPalindrome(x: number): boolean {
  if (x < 0) return false;
  if (x % 10 === 0 && x !== 0) return false;

  let reverted = 0;
  while (x > reverted) {
    reverted = reverted * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === reverted || x === Math.floor(reverted / 10);
}
```

- Each loop iteration removes one digit from `x` → about **O(log₁₀ n)** iterations.
- **Total time complexity:** **O(log n)** (where n is the numeric value).  
- **Space complexity:** **O(1)**.

---

### Summary Table

| Method                  | Time Complexity | Space Complexity | Notes |
|--------------------------|-----------------|-----------------|-------|
| Two-pointer (string)     | O(n)            | O(1)            | Efficient, no extra copy |
| Reverse-and-compare      | O(n)            | O(n)            | Simpler but uses extra memory |
| Numeric (no string)      | O(log n)        | O(1)            | Works directly on digits |

---

👉 So, if you care about **memory efficiency**, the two-pointer method is best for strings, and the digit-reversal method is best for numbers. If you care about **simplicity**, reverse-and-compare is easiest to write.  

Would you like me to also explain **best-case vs worst-case** scenarios for these methods?

#######################################################################################

Alright, let’s walk through **Frequency Maps** in TypeScript, and then break down their **time complexity** just like we did for palindromes.

---

### What is a Frequency Map?

A **frequency map** is a data structure (usually an object or `Map`) that counts how many times each element appears in a collection. It’s commonly used for problems like:

- Counting character occurrences in a string  
- Counting word frequencies in a text  
- Checking if two strings are anagrams  
- Tracking frequency of numbers in an array  

---

### Example in TypeScript

#### Using an object for strings
```ts
export function buildFrequencyMap(str: string): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

// Usage
console.log(buildFrequencyMap("banana"));
// { b: 1, a: 3, n: 2 }
```

#### Using `Map` for arrays
```ts
export function buildFrequencyMapArray(arr: number[]): Map<number, number> {
  const freq = new Map<number, number>();
  for (const num of arr) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  return freq;
}

// Usage
console.log(buildFrequencyMapArray([1, 2, 2, 3, 3, 3]));
// Map { 1 => 1, 2 => 2, 3 => 3 }
```

---

### Time Complexity Analysis

- **Building the frequency map:**
  - You iterate through the input once → **O(n)**, where *n* is the length of the string or array.
  - Each insertion/lookup in an object or `Map` is **O(1)** on average (hash table operations).
  - **Total time complexity:** **O(n)**

- **Space complexity:**
  - You store counts for each unique element.
  - Worst case: all elements are unique → **O(k)**, where *k* is the number of distinct elements.
  - So space complexity is **O(k)**.

---

### Summary Table

| Operation                  | Time Complexity | Space Complexity | Notes |
|-----------------------------|-----------------|-----------------|-------|
| Build frequency map         | O(n)            | O(k)            | k = unique elements |
| Lookup frequency of element | O(1)            | —               | Average case |
| Iterate over map            | O(k)            | —               | Useful for analysis |

---

👉 So, frequency maps are **linear-time to build** and very efficient for counting problems. They trade off extra space proportional to the number of unique elements for fast lookups.  

Would you like me to also show how **frequency maps are used in anagram checks** (a very common application)?

#######################################################################################

