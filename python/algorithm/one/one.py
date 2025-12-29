# ============================================
# Print even numbers from 2 to 20
# ============================================
def print_even_numbers(limit):
    """Prints all even numbers up to a given limit."""
    for num in range(2, limit + 1):
        if num % 2 == 0:
            print(num)


# ============================================
# Using a while loop, print numbers from 10 down to 1
# ============================================
def print_count_down(num):
    """Prints countdown from num down to 1."""
    while num >= 1:
        print(num)
        num -= 1


# ============================================
# Print each letter in a string
# ============================================
def print_each_char(string):
    """Prints each character of a string."""
    for char in string:
        print(char)


# ============================================
# Sum all numbers from 1 to N and print the total
# ============================================
def print_total_sum(limit):
    """Prints the sum of numbers from 1 to limit."""
    total = 0
    for n in range(1, limit + 1):
        total += n
    print(total)


# ============================================
# Print numbers greater than a given threshold
# ============================================
def print_greater_than(threshold, nums=None):
    """Prints numbers in a list that are greater than threshold."""
    if nums is None:
        nums = [3, 7, 2, 9, 4]

    for n in nums:
        if n > threshold:
            print(n)


# ============================================
# Find the largest number in a list
# ============================================
def print_largest_number(numbers=None):
    """Prints the largest number in a list."""
    if numbers is None:
        numbers = [10, 3, 88, 42, 5]

    largest = numbers[0]    # start by assuming the first number is the largest

    # Loop through remaining numbers
    for num in numbers:
        if num > largest:
            largest = num

    print(largest)


# ============================================
# Print all numbers 1–N except a chosen number
# ============================================
def print_all_except(skip, end=10):
    """Prints numbers from 1 to end, except 'skip'."""
    for num in range(1, end + 1):
        if num == skip:
            continue
        print(num)


# ============================================
# Ensure password is provided before proceeding
# ============================================
def require_password():
    """Asks for a password until the user enters something."""
    password = input("Enter new password: ")

    while not password:
        print("Password cannot be empty! Try again.")
        password = input("Enter new password: ")

    print(f"Password accepted: {password}")


# ============================================
# Print multiplication table for a number (1 to 12)
# ============================================
def multiplication_table(num):
    """Prints multiplication table for num up to 12."""
    for i in range(1, 13):
        print(f"{num} x {i} = {num * i}")


# EXAMPLE CALL
multiplication_table(5)
