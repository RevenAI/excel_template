
import { threeSum, threeSumeWhile } from "./three-sum.js";
import { twoSumBrute, twoSumMap, twoSumMapWhile, twoSumWhile } from "./two-some.js";


export function runTwoSome() {
    console.log('TWO SOME BRUTE', twoSumBrute([3, 4, 6, 2, 9, 10], 8))
    console.log('TWO SOME MAP', twoSumMap([3, 4, 6, 2, 9, 10], 8))
    console.log('TWO SOME WHILE LOOP', twoSumWhile([3, 4, 6, 2, 9, 10], 8))
    console.log('TWO SOME MAP WHILE LOOP', twoSumMapWhile([3, 4, 6, 2, 9, 10], 8))
}

export function runThreeSum() {
    console.log('THREE SOME', threeSum([3, 6, 7, 13, 8, 37], 16))
    console.log('THREE SOME WITH WHILE', threeSumeWhile([3, 6, 7, 13, 8, 37], 16))
}

// export function runMore() {
//     console.log('MORE - REVERSED STRING', getTwoSum([3, 6, 7, 13, 8, 37], 10))
//     console.log('MORE - REVERSED STRING', getTwoSum2([3, 6, 7, 13, 8, 37], 10))
//     console.log('MORE - REVERSED STRING', getThreeSum([3, 6, 2, 13, 8, 37], 11))
// }


export function testtwoSum(numbers: number[], target: number): [number, number] | null {
  
  const found = new Map<number, number>()
  let index = 0

  while (index < numbers.length) {
    const needed = target - numbers[index]

    if (found.has(needed)) {
      return [found.get(needed)!, index]
    }
    found.set(numbers[index], index)
    index++
  }
  return null
}

export function testtwoSumWhile(numbers: number[], target: number): [number, number]|null {
  let index1 = 0

  while (index1 < numbers.length) {
    let index2 = index1 + 1

    while (index2 < numbers.length) {
      if (numbers[index1] + numbers[index2] === target) {
        return [index1, index2]
      }
      index2++
    }
    index1++
  }
  return null
}

export function testThreeSum(
    nums: number[], target: number
): [number, number, number]|null {
    let i1 = 0
    while (i1 < nums.length) {
       
        const needed = target - nums[i1]
        const found = new Map<number, number>()
         
        let i2 = i1 + 1

        while (i2 < nums.length) {
            const complement = needed - nums[i2]

            if (found.has(complement)) {
                return [i1, found.get(complement)!, i2]
            }
            found.set(nums[i2], i2)
            i2++
        }
        i1++
    }
    return null
}