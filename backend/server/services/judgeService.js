import axios from "axios";

const JUDGE0_URL = "https://ce.judge0.com/submissions?wait=true";

const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  cpp: 54,
  c: 50,
  java: 62,
  typescript: 74,
};

export const getLanguageId = (language) => {
  return LANGUAGE_MAP[language] || null;
};

export const prepareExecutableCode = ({ code, language, problemSlug }) => {
  if (language !== "cpp" || !code) return code;

  // If code already contains a main function, execute as-is
  if (/\bmain\s*\(/.test(code)) {
    return code;
  }

  // Detect method or problem slug
  let driver = "";
  if (problemSlug === "two-sum" || /\btwoSum\s*\(/.test(code)) {
    driver = `
int main() {
    int target, n;
    if (!(cin >> target >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    Solution sol;
    vector<int> res = sol.twoSum(nums, target);
    for (size_t i = 0; i < res.size(); i++) {
        cout << res[i] << (i + 1 < res.size() ? " " : "");
    }
    cout << endl;
    return 0;
}`;
  } else if (problemSlug === "reverse-string" || /\breverseString\s*\(/.test(code)) {
    driver = `
int main() {
    string s;
    if (cin >> s) {
        Solution sol;
        cout << sol.reverseString(s) << endl;
    }
    return 0;
}`;
  } else if (problemSlug === "palindrome-number" || /\bisPalindrome\s*\(/.test(code)) {
    driver = `
int main() {
    int x;
    if (cin >> x) {
        Solution sol;
        cout << (sol.isPalindrome(x) ? "true" : "false") << endl;
    }
    return 0;
}`;
  } else if (problemSlug === "valid-parentheses" || /\bisValid\s*\(/.test(code)) {
    driver = `
int main() {
    string s;
    if (cin >> s) {
        Solution sol;
        cout << (sol.isValid(s) ? "true" : "false") << endl;
    }
    return 0;
}`;
  } else if (problemSlug === "container-with-most-water" || /\bmaxArea\s*\(/.test(code)) {
    driver = `
int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    Solution sol;
    cout << sol.maxArea(h) << endl;
    return 0;
}`;
  } else if (problemSlug === "longest-substring-without-repeating-characters" || /\blengthOfLongestSubstring\s*\(/.test(code)) {
    driver = `
int main() {
    string s;
    if (cin >> s) {
        Solution sol;
        cout << sol.lengthOfLongestSubstring(s) << endl;
    } else {
        cout << 0 << endl;
    }
    return 0;
}`;
  } else if (problemSlug === "trapping-rain-water" || /\btrap\s*\(/.test(code)) {
    driver = `
int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    Solution sol;
    cout << sol.trap(h) << endl;
    return 0;
}`;
  }

  if (!driver) return code;

  let headers = "";
  if (!code.includes("<iostream>")) headers += "#include <iostream>\n";
  if (!code.includes("<vector>")) headers += "#include <vector>\n";
  if (!code.includes("<string>")) headers += "#include <string>\n";
  if (!code.includes("<algorithm>")) headers += "#include <algorithm>\n";
  if (!code.includes("<unordered_map>")) headers += "#include <unordered_map>\n";
  if (!code.includes("<stack>")) headers += "#include <stack>\n";
  if (!code.includes("using namespace std;")) headers += "using namespace std;\n";

  return `${headers}\n${code}\n${driver}`;
};

export const executeSingleRun = async ({ code, language, input = "", problemSlug = "" }) => {
  const languageId = getLanguageId(language);
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const finalCode = prepareExecutableCode({ code, language, problemSlug });

  const response = await axios.post(JUDGE0_URL, {
    source_code: finalCode,
    language_id: languageId,
    stdin: input,
  });

  const result = response.data;

  const output =
    result.stdout ||
    result.stderr ||
    result.compile_output ||
    result.message ||
    "No Output";

  return {
    output: output.trim(),
    status: result.status?.description || "Completed",
    statusId: result.status?.id,
    time: result.time || "0",
    memory: result.memory || 0,
  };
};

const normalizeOutput = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();
};

export const executeBatchTestCases = async ({ code, language, testCases, problemSlug = "" }) => {
  const results = [];
  let totalPointsEarned = 0;
  let totalPossiblePoints = 0;
  let overallStatus = "Accepted";

  const finalCode = prepareExecutableCode({ code, language, problemSlug });

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    totalPossiblePoints += tc.points || 10;

    try {
      const res = await executeSingleRun({
        code: finalCode,
        language,
        input: tc.input || "",
        problemSlug,
      });

      const actualOutput = (res.output || "").trim();
      const expectedOutput = (tc.expectedOutput || "").trim();

      const normalizedActual = normalizeOutput(actualOutput);
      const normalizedExpected = normalizeOutput(expectedOutput);

      const isAcceptedStatus =
        res.statusId === 3 ||
        res.status === "Accepted" ||
        res.status === "Completed";

      const passed = isAcceptedStatus && normalizedActual === normalizedExpected;

      if (passed) {
        totalPointsEarned += tc.points || 10;
      } else if (overallStatus === "Accepted") {
        if (res.status === "Compilation Error" || res.statusId === 6) {
          overallStatus = "Compilation Error";
        } else if (res.status === "Time Limit Exceeded" || res.statusId === 5) {
          overallStatus = "Time Limit Exceeded";
        } else if (
          res.status?.includes("Runtime Error") ||
          (res.statusId >= 7 && res.statusId <= 12)
        ) {
          overallStatus = "Runtime Error";
        } else {
          overallStatus = "Wrong Answer";
        }
      }

      const caseStatus = passed
        ? "Passed"
        : res.status === "Compilation Error"
        ? "Compilation Error"
        : res.status === "Time Limit Exceeded"
        ? "Time Limit Exceeded"
        : "Wrong Answer";

      results.push({
        testCaseIndex: i + 1,
        isHidden: tc.isHidden,
        passed,
        points: passed ? tc.points || 10 : 0,
        actualOutput: tc.isHidden ? "[HIDDEN]" : actualOutput,
        expectedOutput: tc.isHidden ? "[HIDDEN]" : expectedOutput,
        input: tc.isHidden ? "[HIDDEN]" : tc.input,
        status: caseStatus,
        time: res.time,
        memory: res.memory,
      });

      // If compilation error occurs, subsequent test cases cannot run
      if (caseStatus === "Compilation Error") {
        for (let j = i + 1; j < testCases.length; j++) {
          results.push({
            testCaseIndex: j + 1,
            isHidden: testCases[j].isHidden,
            passed: false,
            points: 0,
            actualOutput: "Did not run",
            expectedOutput: testCases[j].isHidden ? "[HIDDEN]" : testCases[j].expectedOutput,
            input: testCases[j].isHidden ? "[HIDDEN]" : testCases[j].input,
            status: "Did Not Run",
          });
        }
        break;
      }
    } catch (err) {
      if (overallStatus === "Accepted") {
        overallStatus = "Runtime Error";
      }
      results.push({
        testCaseIndex: i + 1,
        isHidden: tc.isHidden,
        passed: false,
        points: 0,
        actualOutput: tc.isHidden ? "[HIDDEN]" : err.message,
        expectedOutput: tc.isHidden ? "[HIDDEN]" : tc.expectedOutput,
        input: tc.isHidden ? "[HIDDEN]" : tc.input,
        status: "Error",
      });
    }
  }

  return {
    overallStatus,
    score: totalPointsEarned,
    totalPossiblePoints,
    passedTests: results.filter((r) => r.passed).length,
    totalTests: testCases.length,
    testResults: results,
  };
};
