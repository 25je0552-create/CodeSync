import Battle from "../server/models/Battle.js";
import { generateLeaderboard } from "../server/services/leaderboardService.js";

const battleSocket = (io) => {
  io.on("connection", (socket) => {
    // ----------------------------
    // JOIN BATTLE
    // ----------------------------
    socket.on("joinBattle", async ({ battleId, username }) => {
      if (!battleId || !username) return;

      socket.join(battleId);
      socket.battleId = battleId;
      socket.username = username;

      console.log(`${username} joined battle room ${battleId}`);

      try {
        const battle = await Battle.findOne({ battleId }).populate(
          "problems.problemId"
        );
        if (!battle) return;

        const player = battle.players.find((p) => p.username === username);
        if (player) {
          player.connected = true;
          await battle.save();
        }

        const updatedBattle = await Battle.findOne({ battleId }).populate(
          "problems.problemId"
        );

        io.to(battleId).emit("battleUpdated", updatedBattle);
        const leaderboard = generateLeaderboard(updatedBattle);
        io.to(battleId).emit("leaderboardUpdated", leaderboard);
      } catch (error) {
        console.error("joinBattle Socket Error:", error);
      }
    });

    // ----------------------------
    // TOGGLE READY
    // ----------------------------
    socket.on("toggleReady", async ({ battleId, username }) => {
      if (!battleId || !username) return;

      try {
        const battle = await Battle.findOne({ battleId });
        if (!battle) return;

        const player = battle.players.find((p) => p.username === username);
        if (!player) return;

        player.ready = !player.ready;
        await battle.save();

        const updatedBattle = await Battle.findOne({ battleId }).populate(
          "problems.problemId"
        );

        io.to(battleId).emit("battleUpdated", updatedBattle);
      } catch (error) {
        console.error("toggleReady Socket Error:", error);
      }
    });

    // ----------------------------
    // START BATTLE
    // ----------------------------
    socket.on("startBattle", async ({ battleId, username }) => {
      if (!battleId || !username) return;

      try {
        const battle = await Battle.findOne({ battleId });
        if (!battle) return;

        if (battle.host !== username) return;
        if (battle.players.length < 1) return;

        const everyoneReady = battle.players.every((p) => p.ready);
        if (!everyoneReady) return;

        const now = new Date();
        const endTime = new Date(now.getTime() + battle.duration * 60 * 1000);

        battle.status = "running";
        battle.startTime = now;
        battle.endTime = endTime;

        await battle.save();

        const updatedBattle = await Battle.findOne({ battleId }).populate(
          "problems.problemId"
        );

        io.to(battleId).emit("battleStarted", updatedBattle);
        io.to(battleId).emit("battleUpdated", updatedBattle);
        const leaderboard = generateLeaderboard(updatedBattle);
        io.to(battleId).emit("leaderboardUpdated", leaderboard);
      } catch (error) {
        console.error("startBattle Socket Error:", error);
      }
    });

    // ----------------------------
    // LEAVE BATTLE
    // ----------------------------
    socket.on("leaveBattle", async ({ battleId, username }) => {
      const bId = battleId || socket.battleId;
      const uName = username || socket.username;
      if (!bId || !uName) return;

      try {
        const battle = await Battle.findOne({ battleId: bId });
        if (!battle) return;

        if (battle.status === "waiting") {
          battle.players = battle.players.filter((p) => p.username !== uName);
        } else {
          const player = battle.players.find((p) => p.username === uName);
          if (player) {
            player.connected = false;
          }
        }

        await battle.save();

        const updatedBattle = await Battle.findOne({ battleId: bId }).populate(
          "problems.problemId"
        );

        socket.leave(bId);
        io.to(bId).emit("playerLeft", { username: uName });
        io.to(bId).emit("battleUpdated", updatedBattle);
        const leaderboard = generateLeaderboard(updatedBattle);
        io.to(bId).emit("leaderboardUpdated", leaderboard);
      } catch (error) {
        console.error("leaveBattle Socket Error:", error);
      }
    });

    // ----------------------------
    // DISCONNECT
    // ----------------------------
    socket.on("disconnect", async () => {
      const bId = socket.battleId;
      const uName = socket.username;
      if (bId && uName) {
        try {
          const battle = await Battle.findOne({ battleId: bId });
          if (battle) {
            const player = battle.players.find((p) => p.username === uName);
            if (player) {
              player.connected = false;
              await battle.save();
              const updatedBattle = await Battle.findOne({
                battleId: bId,
              }).populate("problems.problemId");
              io.to(bId).emit("battleUpdated", updatedBattle);
            }
          }
        } catch (err) {
          console.error("Battle disconnect error:", err);
        }
      }
    });
  });
};

export default battleSocket;