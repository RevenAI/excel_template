import { validateNumList } from "./two-some.js"


export function threeSum(numbers: number[], target: number): [number, number, number] | null {
    validateNumList(numbers)

    for (let i = 0; i < numbers.length; i++) {
        const needed = target - numbers[i]
        const seen = new Map<number, number>()

        for (let j = i + 1; j < numbers.length; j++) {
            const complement = needed - numbers[j]
            if (seen.has(complement)) {
                return [i, seen.get(complement)!, j]
            }
            seen.set(numbers[j], j)
        }
    }
    return null
}


export function threeSumeWhile(
    numbers: number[], target: number
): [number, number, number] | null
{
    let i1 = 0

    while (i1 < numbers.length) {
        const needed = target - numbers[i1]
        const seen = new Map<number, number>()

        let i2 = i1 + 1
        while (i2 < numbers.length) {
            const complement = needed - numbers[i2]

            if (seen.has(complement)) {
                return [i1, seen.get(complement)!, i2]
            }
            seen.set(numbers[i2], i2)
            i2++
        }
        i1++
    }
    return null
}