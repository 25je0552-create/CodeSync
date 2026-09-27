import Battle from "../models/Battle.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { executeBatchTestCases } from "./judgeService.js";
import { generateLeaderboard } from "./leaderboardService.js";

export const processSubmission = async ({
  battleId,
  problemId,
  username,
  language,
  code,
}) => {
  const battle = await Battle.findOne({ battleId });
  if (!battle) {
    throw new Error("Battle not found");
  }

  // Authoritative server timer check
  const now = new Date();
  if (battle.endTime && now > new Date(battle.endTime)) {
    battle.status = "finished";
    await battle.save();
    throw new Error("Battle timer has expired. Submissions are closed.");
  }

  if (battle.status !== "running") {
    throw new Error("Battle is not active.");
  }

  const playerIndex = battle.players.findIndex(
    (p) => p.username === username
  );

  if (playerIndex === -1) {
    throw new Error("Player not registered in this battle room.");
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new Error("Problem not found.");
  }

  // Run test cases through judgeService
  const judgeResult = await executeBatchTestCases({
    code,
    language,
    testCases: problem.testCases || [],
    problemSlug: problem.slug,
  });

  // Calculate max execution time and memory
  let maxTime = 0;
  let maxMem = 0;
  if (judgeResult.testResults) {
    judgeResult.testResults.forEach((tr) => {
      if (tr.time && parseFloat(tr.time) > maxTime) maxTime = parseFloat(tr.time);
      if (tr.memory && parseInt(tr.memory) > maxMem) maxMem = parseInt(tr.memory);
    });
  }

  // Create submission record (append-only)
  const submission = new Submission({
    battleId,
    problemId,
    username,
    language,
    code,
    status: judgeResult.overallStatus,
    passedTests: judgeResult.passedTests,
    totalTests: judgeResult.totalTests,
    score: judgeResult.score,
    executionTime: maxTime,
    memory: maxMem,
  });

  await submission.save();

  // Update Player state in Battle
  const player = battle.players[playerIndex];
  const problemIdStr = problemId.toString();

  if (!player.submissions.includes(submission._id.toString())) {
    player.submissions.push(submission._id.toString());
  }

  player.lastSubmissionAt = now;

  if (judgeResult.overallStatus === "Accepted") {
    if (!player.solved.includes(problemIdStr)) {
      player.solved.push(problemIdStr);
      player.score = (player.score || 0) + judgeResult.score;
    }
  }

  await battle.save();

  const leaderboard = generateLeaderboard(battle);

  return {
    submission,
    judgeResult,
    leaderboard,
    updatedBattle: battle,
  };
};
