import { processSubmission } from "../services/submissionService.js";

export const submitSolution = async (req, res) => {
  try {
    const { battleId, problemId, username, language, code } = req.body;

    if (!battleId || !problemId || !username || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing required submission fields.",
      });
    }

    const { submission, judgeResult, leaderboard, updatedBattle } =
      await processSubmission({
        battleId,
        problemId,
        username,
        language,
        code,
      });

    // Emit real-time socket updates if io instance is available on app
    const io = req.app.get("io");
    if (io) {
      io.to(battleId).emit("leaderboardUpdated", leaderboard);
      io.to(battleId).emit("battleUpdated", updatedBattle);
    }

    res.status(200).json({
      success: true,
      submission,
      overallStatus: judgeResult.overallStatus,
      score: judgeResult.score,
      totalPossiblePoints: judgeResult.totalPossiblePoints,
      passedTests: judgeResult.passedTests,
      totalTests: judgeResult.totalTests,
      testResults: judgeResult.testResults,
      leaderboard,
    });
  } catch (error) {
    console.error("Submission Controller Error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Submission failed",
    });
  }
};
