

// Function to generate Fibonacci sequence up to n terms
export function fibonacci(n: number): number[] {
    if (n <= 0) return []
    if (n === 1) return [0]

    const sequence: number[] = [0, 1]
    let index = 2 //start from the next term after 1

    while (index < n) {
        //set the formular - F(n) = F(n-1) + F)=(n-2)
        const term = sequence[index - 1] + sequence[index - 2]
        sequence.push(term)
        index++
    }
    return sequence
}

export function nthFibonacci(n: number): number {
    if (n < 2) return n

    let a = 0; let b = 1
    let i = 2

    while (i < n) {
        const next = a + b
        a = b
        b = next
        i++
    }
    return b
}

export function fibRecursive(n: number): number {
    if (n < 2) return n
    return fibRecursive(n - 1) + fibRecursive(n - 2)
}

