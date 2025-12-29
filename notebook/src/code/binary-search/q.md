
Practice binary search


/**
 * Performs a binary search for a target value in a sorted array.
 * Time Complexity: O(log n)
 * @param arr The sorted array of numbers.
 * @param target The value to search for.
 * @returns The index of the target if found, otherwise -1.
 */
function binarySearch(arr: number[], target: number): number {
    let low = 0;
    let high = arr.length - 1;

    // While the search range is valid
    while (low <= high) {
        // Calculate the middle index (integer division)
        const mid = Math.floor((low + high) / 2);
        const guess = arr[mid];

        // Check if the middle element is the target
        if (guess === target) {
            return mid; // Target found
        }
        
        // If the guess is too high, ignore the right half
        if (guess > target) {
            high = mid - 1;
        } 
        // If the guess is too low, ignore the left half
        else {
            low = mid + 1;
        }
    }

    return -1; // Target not found
}

// Example Usage:
const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const target = 13;
const resultIndex = binarySearch(sortedArray, target);

console.log(`Array size (n): ${sortedArray.length}`);
console.log(`Target ${target} found at index: ${resultIndex}`);
// For n=16, it takes a maximum of 4 comparisons (log2(16) = 4)
