import Battle from "../models/Battle.js";
import Problem from "../models/Problem.js";
import { generateLeaderboard } from "../services/leaderboardService.js";
import { seedProblems } from "../utils/seedProblems.js";

const generateBattleId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createBattle = async (req, res) => {
  try {
    const {
      battleName,
      difficulty,
      languages,
      duration,
      playerCapacity,
      battleType,
      allowSpectators,
      host,
      problemSelectionMode = "random",
      numberOfProblems = 1,
      selectedProblemIds = [],
    } = req.body;

    if (!battleName) {
      return res.status(400).json({ message: "Battle name is required" });
    }

    if (!languages || languages.length === 0) {
      return res.status(400).json({ message: "Select at least one language" });
    }

    // Ensure database has problems seeded
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      await seedProblems();
    }

    // Format difficulty string/array for storage
    let formattedDifficulty = "Easy";
    if (Array.isArray(difficulty) && difficulty.length > 0) {
      formattedDifficulty = difficulty.join(", ");
    } else if (typeof difficulty === "string") {
      formattedDifficulty = difficulty;
    }

    let battleProblems = [];

    if (problemSelectionMode === "selected" && selectedProblemIds.length > 0) {
      battleProblems = selectedProblemIds.map((id, index) => ({
        problemId: id,
        order: index + 1,
      }));
    } else {
      // Random Problem Selection matching selected difficulties
      const query = {};
      let diffList = [];
      if (Array.isArray(difficulty)) {
        diffList = difficulty;
      } else if (typeof difficulty === "string" && difficulty.trim() !== "") {
        diffList = difficulty.split(",").map((d) => d.trim());
      }
      diffList = diffList.filter(
        (d) => d && d.toLowerCase() !== "mixed" && d.toLowerCase() !== "all"
      );

      if (diffList.length > 0) {
        const regexList = diffList.map((d) => new RegExp(`^${d}$`, "i"));
        query.difficulty = { $in: regexList };
      }

      let matchedProblems = await Problem.find(query);
      if (matchedProblems.length === 0) {
        matchedProblems = await Problem.find({});
      }

      // Shuffle matched problems randomly
      const shuffled = [...matchedProblems].sort(() => 0.5 - Math.random());
      const countToPick = Math.max(1, Math.min(numberOfProblems || 1, shuffled.length));
      const selected = shuffled.slice(0, countToPick);

      battleProblems = selected.map((prob, index) => ({
        problemId: prob._id,
        order: index + 1,
      }));
    }

    const battleId = generateBattleId();

    const battle = new Battle({
      battleId,
      battleName,
      host,
      difficulty: formattedDifficulty,
      languages,
      duration: duration || 30,
      playerCapacity: playerCapacity || 2,
      battleType: battleType || "private",
      allowSpectators: !!allowSpectators,
      problemSelectionMode,
      numberOfProblems: battleProblems.length,
      problems: battleProblems,
      players: [
        {
          username: host,
          ready: false,
          score: 0,
          language: languages[0] || "cpp",
          connected: true,
        },
      ],
    });

    await battle.save();

    const populatedBattle = await Battle.findOne({ battleId }).populate(
      "problems.problemId"
    );

    res.status(201).json({
      success: true,
      battleId,
      battle: populatedBattle,
    });
  } catch (error) {
    console.error("Create Battle Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create battle.",
    });
  }
};

export const getBattle = async (req, res) => {
  try {
    const { battleId } = req.params;

    let battle = await Battle.findOne({ battleId }).populate(
      "problems.problemId"
    );

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    // Auto-heal empty problems array if any
    if (!battle.problems || battle.problems.length === 0 || battle.problems.some(p => !p.problemId)) {
      const allProblems = await Problem.find({});
      if (allProblems.length > 0) {
        battle.problems = allProblems.slice(0, 2).map((prob, idx) => ({
          problemId: prob._id,
          order: idx + 1,
        }));
        await battle.save();
        battle = await Battle.findOne({ battleId }).populate("problems.problemId");
      }
    }

    // Server-authoritative timer expiry check
    if (
      battle.status === "running" &&
      battle.endTime &&
      new Date() > new Date(battle.endTime)
    ) {
      battle.status = "finished";
      await battle.save();
    }

    res.status(200).json({
      success: true,
      battle,
    });
  } catch (error) {
    console.error("Get Battle Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const joinBattle = async (req, res) => {
  try {
    const { battleId, username } = req.body;

    const battle = await Battle.findOne({ battleId });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    if (battle.status !== "waiting" && battle.status !== "running") {
      return res.status(400).json({
        success: false,
        message: "Battle already finished",
      });
    }

    const player = battle.players.find((p) => p.username === username);

    if (!player) {
      if (battle.players.length >= battle.playerCapacity) {
        return res.status(400).json({
          success: false,
          message: "Battle is full",
        });
      }

      battle.players.push({
        username,
        ready: false,
        score: 0,
        language: battle.languages[0] || "cpp",
        connected: true,
      });
      await battle.save();
    } else {
      player.connected = true;
      await battle.save();
    }

    const populatedBattle = await Battle.findOne({ battleId }).populate(
      "problems.problemId"
    );

    res.status(200).json({
      success: true,
      battle: populatedBattle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const startBattle = async (req, res) => {
  try {
    const { battleId, username } = req.body;

    const battle = await Battle.findOne({ battleId });

    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    if (battle.host !== username) {
      return res
        .status(403)
        .json({ message: "Only the host can start the battle" });
    }

    if (battle.players.length < 1) {
      return res
        .status(400)
        .json({ message: "At least 1 player is required" });
    }

    const everyoneReady = battle.players.every((p) => p.ready);
    if (!everyoneReady) {
      return res
        .status(400)
        .json({ message: "All players must be ready to start" });
    }

    const now = new Date();
    const endTime = new Date(now.getTime() + battle.duration * 60 * 1000);

    battle.status = "running";
    battle.startTime = now;
    battle.endTime = endTime;

    await battle.save();

    const populatedBattle = await Battle.findOne({ battleId }).populate(
      "problems.problemId"
    );

    const io = req.app.get("io");
    if (io) {
      io.to(battleId).emit("battleStarted", populatedBattle);
      io.to(battleId).emit("battleUpdated", populatedBattle);
      const leaderboard = generateLeaderboard(populatedBattle);
      io.to(battleId).emit("leaderboardUpdated", leaderboard);
    }

    res.status(200).json({
      success: true,
      battle: populatedBattle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const leaveBattle = async (req, res) => {
  try {
    const { battleId, username } = req.body;

    const battle = await Battle.findOne({ battleId });
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    if (battle.status === "waiting") {
      battle.players = battle.players.filter((p) => p.username !== username);
    } else {
      const player = battle.players.find((p) => p.username === username);
      if (player) {
        player.connected = false;
      }
    }

    await battle.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { battleId } = req.params;

    const battle = await Battle.findOne({ battleId });
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    const leaderboard = generateLeaderboard(battle);

    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};