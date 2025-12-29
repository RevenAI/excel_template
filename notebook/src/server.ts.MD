import http from "http"
import { Request, Response } from "./types/http.type.js"
import { findMostFrequentElement } from "./code/one/one.js";
import { filterConditions, /* formatFilterClone, */ formatFilterMutate, stringManipulation, /* getFileMime */ validateAndSanitizeBoolean, validateBooleanOptions } from "./learn/practice-obj.js";
import { getTwoSomeExponential, getTwoSomeFactorial, lockedBox, pwdFile, unlockMyBox } from "./code/two-some/brute-force.js";
//import { bruteForce } from "./code/two-some/brute-force.js"

const PORT = 3500;

const server = http.createServer((req: Request, res: Response) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Server is running");
});

//console.log(findMostFrequentElement())
// console.log('Mutated Version', formatFilterMutate(filterConditions))
//console.log('Cloned Version', formatFilterClone(filterConditions))

//run
const nums = [2,7,11,15,9]
const target = 13
// console.log('[Get Two Some Factorial]', getTwoSomeFactorial(nums, target))
// console.log('[Get Two Some Exponential]', getTwoSomeExponential(nums, target))
// console.log('[Unclock Box Result] Box Unlock:', unlockMyBox(lockedBox, pwdFile))

// console.log('[MIME] GET MIME PART:', getFileMime('money.lockedBox.png'))

// const bools = validateBooleanOptions({isNamed: 'true', isRead: 'false'})
// console.log('[MIME] VALIDATE BOOLEAN:', bools)

//console.log('[String Manipuldation] String', stringManipulation('Abidemi Ibrahim'))

// function sumList(list: number[]): number {
//   const invalidNumber = list.filter(n => typeof n !== 'number')
//   if (invalidNumber.length) {
//     throw new Error(`List can only contain valid numeric value. The following input are not valid ${invalidNumber.join(', ')}`)
//   }

//   let sum: number = 0
//   // for (const n of list) {
//   //   sum += n;
//   // }

//   for (let i = 0; i < list.length; i++) {
//     sum += list[i]
//   }

//   return sum
// }

// function reverseString(value: string): string {
//   let reversed = "";
//   // Start from the last character and move backwards
//   for (let i = value.length - 1; i >= 0; i--) {
//     reversed += value[i];
//   }
//   return reversed;
// }

// function reverseString(value: string): string {
//   const reversed: string[] = [];
//   for (let i = value.length - 1; i >= 0; i--) {
//     reversed.push(value[i]);
//   }
//   return reversed.join("");
// }


//console.log('TEST Big-O', sumList([4, 5, 2, 5, 7]))
//console.log('REVERSED STRING', reverseString('introduction'))

server.listen(PORT, () => {
  console.log(`[APP ENTRY - src/server.ts] Server running on port ${PORT}`)
})




