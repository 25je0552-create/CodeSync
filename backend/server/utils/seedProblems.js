import Problem from "../models/Problem.js";

const sampleProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    inputFormat: "Line 1: Target integer\nLine 2: N (number of elements)\nLine 3: N space-separated integers",
    outputFormat: "Two space-separated indices (0-indexed)",
    executionMode: "stdin",
    supportedLanguages: ["cpp", "python", "java", "javascript", "c"],
    starterCode: {
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
      python: `import sys\n\ndef main():\n    lines = sys.stdin.read().split()\n    if not lines:\n        return\n    target = int(lines[0])\n    n = int(lines[1])\n    nums = [int(x) for x in lines[2:2+n]]\n    \n    # TODO: Write your solution here\n    # Print the two indices separated by a space (e.g. print(f"{i} {j}"))\n\nif __name__ == "__main__":\n    main()`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int target = sc.nextInt();\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        \n        // TODO: Write your solution here\n        // System.out.println(i + " " + j);\n    }\n}`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n  const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n  if (input.length < 2) return;\n  const target = parseInt(input[0]);\n  const n = parseInt(input[1]);\n  const nums = input.slice(2, 2 + n).map(Number);\n\n  // TODO: Write your solution here\n  // console.log(\`\${i} \${j}\`);\n}\n\nsolve();`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int target, n;\n    if (scanf("%d %d", &target, &n) != 2) return 0;\n    int *nums = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    \n    // TODO: Write your solution here\n    // printf("%d %d\\n", i, j);\n    \n    free(nums);\n    return 0;\n}`
    },
    examples: [
      { input: "9\n4\n2 7 11 15", output: "0 1", explanation: "nums[0] + nums[1] == 9, so return 0 1." },
      { input: "6\n3\n3 2 4", output: "1 2", explanation: "nums[1] + nums[2] == 6, so return 1 2." }
    ],
    testCases: [
      { input: "9\n4\n2 7 11 15", expectedOutput: "0 1", isHidden: false, points: 25 },
      { input: "6\n3\n3 2 4", expectedOutput: "1 2", isHidden: false, points: 25 },
      { input: "6\n2\n3 3", expectedOutput: "0 1", isHidden: true, points: 25 },
      { input: "100\n5\n10 20 30 40 60", expectedOutput: "3 4", isHidden: true, points: 25 }
    ]
  },
  {
    title: "Reverse String",
    slug: "reverse-string",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    description: "Write a function that reverses a string passed on standard input.",
    constraints: ["1 <= string.length <= 10^5"],
    inputFormat: "Line 1: A single word or string",
    outputFormat: "The reversed string",
    executionMode: "stdin",
    supportedLanguages: ["cpp", "python", "java", "javascript", "c"],
    starterCode: {
      cpp: `class Solution {\npublic:\n    string reverseString(string s) {\n        \n    }\n};`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    if not s:\n        return\n    # TODO: Reverse string and print result\n\nif __name__ == "__main__":\n    main()`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            // TODO: Reverse string and print result\n        }\n    }\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\n\n// TODO: Reverse string and print result\n`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100005];\n    if (scanf("%s", s) == 1) {\n        // TODO: Reverse string and print result\n    }\n    return 0;\n}`
    },
    examples: [{ input: "hello", output: "olleh", explanation: "Reverse of hello is olleh" }],
    testCases: [
      { input: "hello", expectedOutput: "olleh", isHidden: false, points: 50 },
      { input: "Hannah", expectedOutput: "hannaH", isHidden: true, points: 50 }
    ]
  },
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "Easy",
    tags: ["Math"],
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    inputFormat: "Line 1: Integer x",
    outputFormat: "'true' or 'false'",
    executionMode: "stdin",
    supportedLanguages: ["cpp", "python", "java", "javascript", "c"],
    starterCode: {
      cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    # TODO: Output 'true' if palindrome, else 'false'\n\nif __name__ == "__main__":\n    main()`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            // TODO: Output 'true' or 'false'\n        }\n    }\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\n// TODO: Output 'true' or 'false'\n`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100];\n    if (scanf("%s", s) == 1) {\n        // TODO: Output 'true' or 'false'\n    }\n    return 0;\n}`
    },
    examples: [
      { input: "121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
      { input: "-121", output: "false", explanation: "From left to right, it reads -121. From right to left it becomes 121-." }
    ],
    testCases: [
      { input: "121", expectedOutput: "true", isHidden: false, points: 50 },
      { input: "-121", expectedOutput: "false", isHidden: true, points: 50 }
    ]
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    constraints: ["1 <= s.length <= 10^4"],
    inputFormat: "Line 1: A bracket string s",
    outputFormat: "'true' or 'false'",
    executionMode: "stdin",
    supportedLanguages: ["cpp", "python", "java", "javascript", "c"],
    starterCode: {
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    # TODO: Verify valid brackets, print 'true' or 'false'\n\nif __name__ == "__main__":\n    main()`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            // TODO: Print 'true' or 'false'\n        }\n    }\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\n// TODO: Print 'true' or 'false'\n`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[10005];\n    if (scanf("%s", s) == 1) {\n        // TODO: Print 'true' or 'false'\n    }\n    return 0;\n}`
    },
    examples: [
      { input: "()[]{}", output: "true", explanation: "Valid bracket sequence" },
      { input: "(]", output: "false", explanation: "Mismatched closing bracket" }
    ],
    testCases: [
      { input: "()[]{}", expectedOutput: "true", isHidden: false, points: 50 },
      { input: "(]", expectedOutput: "false", isHidden: true, points: 50 }
    ]
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    description: "Given n non-negative integers representing heights of lines, find two lines that together with the x-axis form a container containing the most water.",
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    inputFormat: "Line 1: N\nLine 2: N space-separated heights",
    outputFormat: "Maximum area of water",
    executionMode: "stdin",
    supportedLanguages: ["cpp", "python", "java", "javascript", "c"],
    starterCode: {
      cpp: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    h = [int(x) for x in data[1:1+n]]\n    \n    # TODO: Calculate max container water area and print it\n\nif __name__ == "__main__":\n    main()`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        \n        // TODO: Print max water area\n    }\n}`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (!input[0]) process.exit(0);\nconst n = parseInt(input[0]);\nconst h = input.slice(1, 1 + n).map(Number);\n\n// TODO: Calculate max container water area and print it\n`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int *h = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf("%d", &h[i]);\n    \n    // TODO: Print max water area\n    \n    free(h);\n    return 0;\n}`
    },
    examples: [{ input: "9\n1 8 6 2 5 4 8 3 7", output: "49", explanation: "The max area is formed by lines at index 1 and 8" }],
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", isHidden: false, points: 50 },
      { input: "2\n1 1", expectedOutput: "1", isHidden: true, points: 50 }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    constraints: ["0 <= s.length <= 5 * 10^4"],
    inputFormat: "Line 1: A string s",
    outputFormat: "Length of the longest non-repeating substring",
    executionMode: "stdin",
    supportedLanguages: ["cpp", "python", "java", "javascript", "c"],
    starterCode: {
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    # TODO: Print length of longest substring without repeating characters\n\nif __name__ == "__main__":\n    main()`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            // TODO: Print length of longest substring without repeating chars\n        } else {\n            System.out.println(0);\n        }\n    }\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\n\n// TODO: Print length of longest substring without repeating characters\n`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[50005];\n    if (scanf("%s", s) == 1) {\n        // TODO: Print length of longest substring without repeating chars\n    } else {\n        printf("0\\n");\n    }\n    return 0;\n}`
    },
    examples: [{ input: "abcabcbb", output: "3", explanation: "The answer is 'abc', with the length of 3." }],
    testCases: [
      { input: "abcabcbb", expectedOutput: "3", isHidden: false, points: 50 },
      { input: "bbbbb", expectedOutput: "1", isHidden: true, points: 50 }
    ]
  },
  {
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming"],
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    inputFormat: "Line 1: N\nLine 2: N space-separated heights",
    outputFormat: "Total water trapped",
    executionMode: "stdin",
    supportedLanguages: ["cpp", "python", "java", "javascript", "c"],
    starterCode: {
      cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    h = [int(x) for x in data[1:1+n]]\n    \n    # TODO: Calculate trapped rain water and print total\n\nif __name__ == "__main__":\n    main()`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        \n        // TODO: Print total trapped rain water\n    }\n}`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (!input[0]) process.exit(0);\nconst n = parseInt(input[0]);\nconst h = input.slice(1, 1 + n).map(Number);\n\n// TODO: Calculate trapped rain water and print total\n`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int *h = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf("%d", &h[i]);\n    \n    // TODO: Print total trapped rain water\n    \n    free(h);\n    return 0;\n}`
    },
    examples: [{ input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6", explanation: "Traps 6 units of rain water" }],
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", isHidden: false, points: 50 },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9", isHidden: true, points: 50 }
    ]
  }
];

export const seedProblems = async () => {
  try {
    for (const prob of sampleProblems) {
      await Problem.findOneAndUpdate(
        { slug: prob.slug },
        { $set: prob },
        { upsert: true, new: true }
      );
    }
    console.log("Competitive Problems starter templates updated in MongoDB!");
  } catch (error) {
    console.error("Error seeding problems:", error);
  }
};
