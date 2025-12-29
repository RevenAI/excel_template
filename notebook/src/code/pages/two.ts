


export function reverseString2(value: string): string {
    return value.split('').reverse().join('')
}

//for loop with string manipulation
export function reverseString1(value: string): string {
    let reversed = ''

    for (let i = value.length-1; i >= 0; i--) {
        reversed += value[i]
    }

    return reversed
}

//for loop with array mutation
export function reverseString3(value: string): string {
    let reversed = []
    for (let i = value.length-1; i >= 0; i--) {
        reversed.push(value[i])
    }
    return reversed.join('')
}

//using recursion
export function reverseString4(v: string): string {
    //base case
    if (!v || v.length ===0) return ''
    //recursion
    return reverseString4(v.slice(1)) + v[0]
}

//using whhile loop
export function reverseString5(value: string): string {
    if (!value || value.length <= 0) return ''

    let i = value.length - 1
    let reversed = ''
    while (i >= 0) {
        reversed += value[i]
        i--
    }

    return reversed
}

//using array reduce
export function reverseString6(value: string): string {
    return value.split('').reduce((acc, cur) => (cur + acc), '')
}

//using loop
export function reverseLastFiveString(value: string): string {
    const start = value.length-1
    const end = Math.max(0, value.length - 5)

    let reversed = ''
    for (let i = start; i >= end; i--) {
        reversed += value[i]
    }

    return reversed
}

//consice
export function reverseLastStringFive2(value: string): string {
    return value.slice(-5).split('').reverse().join(' ')
}