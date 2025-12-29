from collections import Counter

""" Reusable codes and methods """
sample_numbers = [34, 5, 90, 50, 5, 7, 5, 23, 20]

def is_empty_list(list):
    if not list or list == None or len(list) == 0:
        return True
    else: 
        return False


def select_largest_num(number_list=None):
    if is_empty_list(number_list):
        number_list = sample_numbers
        
    largest_number = number_list[0]
    
    for num in number_list:
        if num > largest_number:
            largest_number = num
            
    return largest_number

print(f"Largest Number in list: { select_largest_num() }")

def remove_duplicate_num(number_list=None):
    if is_empty_list(number_list):
        number_list = sample_numbers
    
    duplicate_list = []
    seen = []
    
    for num in number_list:
        if num in seen and num not in duplicate_list:
            duplicate_list.append(num)
        else:
            seen.append(num)
            
    if is_empty_list(duplicate_list):
        return "No duplicate number in the provided list"
    else: 
        return "Duplicate in list:" + str(duplicate_list)
    
print(remove_duplicate_num())



def find_most_frequent_python(my_list):
  """Finds the most frequent element in a list using Counter."""
  if not my_list:
    return None # Handle empty list case
  
  counts = Counter(my_list)
  
  # most_common(1) returns a list of the single most common item, e.g., [('apple', 3)]
  # We use indexing to get the item itself
  most_common_item = counts.most_common(1)[0][0]
  return most_common_item

fruits = ['apple', 'orange', 'apple', 'banana', 'orange', 'apple']
most_frequent_fruit = find_most_frequent_python(fruits)
print(f"The most frequent fruit is: {most_frequent_fruit}")
# Output: The most frequent fruit is: apple

