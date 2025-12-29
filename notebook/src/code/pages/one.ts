
const sampleData = [45, 4, 4, 4, 89, 0, 34, 6, 71]
const isEmpty = (arrayData: number[]) => {
    return Array.isArray(arrayData) && arrayData.length === 0
} 

export function findMostFrequentElement(numbers?: number[]) {
  if (!numbers || isEmpty(numbers)) {
    numbers = sampleData
  }

  const frequencyMap = {};
  let maxCount: number = 0;
  let mostFrequentElement: string|number = '';

  // Build the frequency map and find the max count
  for (const element of numbers) {
    // Increment the count for the current element, defaulting to 0
    frequencyMap[element] = (frequencyMap[element] || 0) + 1;
    
    // Check if the current element has a higher frequency
    if (frequencyMap[element] > maxCount) {
      maxCount = frequencyMap[element];
      mostFrequentElement = element;
    }
  }
  
  return mostFrequentElement;
}

const fruits = ['apple', 'orange', 'apple', 'banana', 'orange', 'apple'];
const mostFrequentFruit = findMostFrequentElement(fruits);
console.log(`The most frequent fruit is: ${mostFrequentFruit}`);
// Output: The most frequent fruit is: apple





// const sampleData = [45, 4, 4, 4, 89, 0, 34, 6, 71]
// const isEmpty = (arrayData: number[]) => {
//     return Array.isArray(arrayData) && arrayData.length === 0
// } 

// export function removeDuplicateNum(numbers?: number[]) {
//     const numberArray = numbers && !isEmpty(numbers) ?
//                         numbers : sampleData

//     let duplicates: number[] = []
//     //let seen: number[] = []
    
//     for (const num of numberArray) {
//         if (!duplicates.includes(num) || duplicates.length === 0){
//             duplicates.push(num)
//         } 
//         //else {
//         //    duplicates.push(num)
//         //}
//     }
//     return isEmpty(duplicates) ? "No duplicate found in the provided numbers" : duplicates
// }



