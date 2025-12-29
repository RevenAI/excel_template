
export function validateNumList(nums: number[]): void {
     if (!nums || !Array.isArray(nums)) {
         throw new Error('First input must be a valid numeric list')
     }
     const dirtInNums = nums.filter((n: number) => Number.isNaN(n));
     if (dirtInNums.length > 0) {
         throw new Error(`Invalid numeric values in number list: ${dirtInNums.join(', ')}`)
     }
}


export function bruteForce(
    trials: string[] | number[], 
    target: string | number
) {
for (let i = 0; i < trials.length; i++) {
    if (trials[i] === target) {
        return 'I just crack it!' + trials[i]
    } else {
        return 'Not found. Try another means'
    }}
};

//using brute force - O(n2)
export function twoSumBrute(nums: number[], target: number): [number, number] | null {
    validateNumList(nums)

    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j]
            }
        }
    }
    return null
}

//using brute force - while loop (O(n2))
export function twoSumWhile(numbers: number[], target: number): [number, number] | null {
    validateNumList(numbers)

    let i1 = 0

    while (i1 < numbers.length) {
        let i2 = i1 + 1

        while (i2 < numbers.length) {
           if (numbers[i1] + numbers[i2] === target) {
                return [i1, i2]
           }
           i2++
        }
        i1++
    }
    return null
}

//using hash map with while loop 
export function twoSumMapWhile(numbers: number[], target: number): [number, number] | null {
    validateNumList(numbers)

    const map = new Map<number, number>()

    let index = 0

    while (index < numbers.length) {
        const needed = target - numbers[index]

        if (map.has(needed)) {
            return [map.get(needed)!, index]
        }
        map.set(numbers[index], index)
        index++
    }

    return null
}

//using hash map - O(n)
export function twoSumMap(nums: number[], target: number): [number, number] | null {
    validateNumList(nums)

    const map = new Map<number, number>()

    for (let i = 0; i < nums.length; i++) {
        const needed = target - nums[i]

        if (map.has(needed)) {
            return [map.get(needed)!, i]
        }

        map.set(nums[i], i)
    }

    return null
}


/**
 * 
 * Miss forgets the password to her box. There are set of hundreds of passwords in her 
 * file - one (just one of those password) definetly opens the box.
 * Write an algorithm to get the only one working password
 * and open the box. Store the working password for another time easy access.
 * 
 */
 export const lockedBox = ['345678']
 export const pwdFile = ['eryuer', '458sjksjkw', '9045eriireo', 'jerieurie', '345678', 7878, 'uriuer', 567845]

type Box = number[] | string[] | (number | string)[]
type UnlockResult = Record<string, (string|number|boolean)>
export function unlockMyBox(
    box: Box, 
    passwordFile: (string | number)[]
): UnlockResult {
    let unlockResult: UnlockResult = {}
    for (let i = 0; i < passwordFile.length; i++) {
        if (passwordFile[i] === box[0]) {
            unlockResult.WORKING_PSW = passwordFile[i]
            unlockResult.isBoxOpen = true
        }
    }
 
    return unlockResult
}