import { fibonacci, fibRecursive, nthFibonacci } from "./fib.js"


export function runFib() {
    // Example: first 10 Fibonacci numbers
console.log('Sequence to a given nth', fibonacci(10))
console.log('Fib number of nth', nthFibonacci(10))
console.log('Fib recusive', fibRecursive(10))
}