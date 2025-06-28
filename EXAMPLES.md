# Code Examples for Testing Judge0 Integration

Here are some example code snippets you can use to test the Judge0 API integration in your Quick-Code application.

## JavaScript Examples

### Basic Hello World
```javascript
console.log("Hello World!");
```

### Input/Output Example
```javascript
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your name: ', (name) => {
    console.log(`Hello, ${name}!`);
    rl.close();
});
```

### Simple Calculator
```javascript
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter first number: ', (num1) => {
    rl.question('Enter second number: ', (num2) => {
        const sum = parseInt(num1) + parseInt(num2);
        console.log(`Sum: ${sum}`);
        rl.close();
    });
});
```

## Python Examples

### Basic Hello World
```python
print("Hello World!")
```

### Input/Output Example
```python
name = input("Enter your name: ")
print(f"Hello, {name}!")
```

### Simple Calculator
```python
num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))
print(f"Sum: {num1 + num2}")
```

### List Operations
```python
numbers = [1, 2, 3, 4, 5]
print(f"Original list: {numbers}")
print(f"Sum: {sum(numbers)}")
print(f"Average: {sum(numbers) / len(numbers)}")
```

## C++ Examples

### Basic Hello World
```cpp
#include <iostream>

int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}
```

### Input/Output Example
```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "Enter your name: ";
    std::getline(std::cin, name);
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}
```

### Simple Calculator
```cpp
#include <iostream>

int main() {
    int num1, num2;
    std::cout << "Enter first number: ";
    std::cin >> num1;
    std::cout << "Enter second number: ";
    std::cin >> num2;
    std::cout << "Sum: " << num1 + num2 << std::endl;
    return 0;
}
```

## Java Examples

### Basic Hello World
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

### Input/Output Example
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
        scanner.close();
    }
}
```

### Simple Calculator
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter first number: ");
        int num1 = scanner.nextInt();
        System.out.print("Enter second number: ");
        int num2 = scanner.nextInt();
        System.out.println("Sum: " + (num1 + num2));
        scanner.close();
    }
}
```

## C Examples

### Basic Hello World
```c
#include <stdio.h>

int main() {
    printf("Hello World!\n");
    return 0;
}
```

### Input/Output Example
```c
#include <stdio.h>

int main() {
    char name[100];
    printf("Enter your name: ");
    scanf("%s", name);
    printf("Hello, %s!\n", name);
    return 0;
}
```

### Simple Calculator
```c
#include <stdio.h>

int main() {
    int num1, num2;
    printf("Enter first number: ");
    scanf("%d", &num1);
    printf("Enter second number: ");
    scanf("%d", &num2);
    printf("Sum: %d\n", num1 + num2);
    return 0;
}
```

## Testing Different Scenarios

### 1. Compilation Error Test
Try this JavaScript code with a syntax error:
```javascript
console.log("Hello World!"
// Missing closing parenthesis
```

### 2. Runtime Error Test
Try this Python code:
```python
print(10 / 0)  # Division by zero
```

### 3. Time Limit Test
Try this Python code (might hit time limit):
```python
import time
time.sleep(10)  # Sleep for 10 seconds
print("Done!")
```

### 4. Memory Limit Test
Try this Python code (might hit memory limit):
```python
# Create a very large list
large_list = [0] * 1000000000
print("Large list created!")
```

### 5. Input/Output Test
Use this Python code with input:
```python
name = input()
age = int(input())
print(f"Name: {name}, Age: {age}")
```

Input:
```
John
25
```

Expected Output:
```
Name: John, Age: 25
```

## Tips for Testing

1. **Start Simple**: Begin with basic "Hello World" examples
2. **Test Input/Output**: Use examples that require user input
3. **Test Error Handling**: Try code with syntax errors and runtime errors
4. **Test Limits**: Try code that might hit time or memory limits
5. **Test Collaboration**: Have multiple users join the same room and test real-time features

## Common Issues and Solutions

### Issue: "No output" for input-based code
**Solution**: Make sure to provide input in the input textarea before running the code.

### Issue: Code runs but shows no output
**Solution**: Some languages require explicit output statements. Make sure your code includes print/console.log statements.

### Issue: Input not working for certain languages
**Solution**: Different languages handle input differently. Use the examples above as templates.

### Issue: Code execution takes too long
**Solution**: The Judge0 API has time limits. Keep your code simple and efficient for testing. 