import {
  executeSingleRun,
  executeBatchTestCases,
} from "../services/judgeService.js";

export const handleExecuteCode = async (req, res) => {
  try {
    const { code, language, input, testCases, problemSlug } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ output: "Please write code before running." });
    }

    if (!language) {
      return res.status(400).json({ output: "Language is required." });
    }

    // If batch test cases (sample cases) provided for Run Code
    if (Array.isArray(testCases) && testCases.length > 0) {
      const batchResult = await executeBatchTestCases({
        code,
        language,
        testCases,
        problemSlug,
      });

      return res.status(200).json({
        success: true,
        isBatch: true,
        overallStatus: batchResult.overallStatus,
        passedTests: batchResult.passedTests,
        totalTests: batchResult.totalTests,
        testResults: batchResult.testResults,
        output:
          batchResult.overallStatus === "Accepted"
            ? "All sample test cases passed!"
            : `${batchResult.passedTests}/${batchResult.totalTests} sample test cases passed.`,
      });
    }

    // Single run execution
    const result = await executeSingleRun({ code, language, input, problemSlug });

    res.status(200).json({
      success: true,
      isBatch: false,
      output: result.output,
      status: result.status,
      time: result.time,
      memory: result.memory,
    });
  } catch (error) {
    console.error("Execute Controller Error:", error.message);
    res.status(500).json({
      output: error.message || "Error executing code",
    });
  }
};
