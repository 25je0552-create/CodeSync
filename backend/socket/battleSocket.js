import Battle from "../server/models/Battle.js";

const battleSocket = (io) => {

  io.on("connection", (socket) => {

    // ----------------------------
    // JOIN BATTLE
    // ----------------------------

    socket.on("joinBattle", async ({ battleId, username }) => {

      socket.join(battleId);

      console.log(`${username} joined ${battleId}`);

      const battle = await Battle.findOne({ battleId });

      if (!battle) return;

      io.to(battleId).emit("battleUpdated", battle);

    });

    // ----------------------------
    // TOGGLE READY
    // ----------------------------

    socket.on("toggleReady", async ({ battleId, username }) => {

      try {

        const battle = await Battle.findOne({
          battleId,
        });

        if (!battle) return;

        const player = battle.players.find(
          (p) => p.username === username
        );

        if (!player) return;

        player.ready = !player.ready;

        await battle.save();

        const updatedBattle = await Battle.findOne({
  battleId,
});

io.to(battleId).emit(
  "battleUpdated",
  updatedBattle
);
        console.log(
          `${username} is now ${
            player.ready ? "READY" : "NOT READY"
          }`
        );

      } catch (error) {

        console.error(error);

      }

    });

    // ----------------------------
// START BATTLE
// ----------------------------

socket.on(
  "startBattle",
  async ({ battleId, username }) => {

    try {

      const battle = await Battle.findOne({
        battleId,
      });

      if (!battle) return;

      // Only host can start

      if (battle.host !== username)
        return;

      // Minimum players

      if (battle.players.length < 2)
        return;

      // Everyone ready

      const everyoneReady =
        battle.players.every(
          player => player.ready
        );

      if (!everyoneReady)
        return;

      battle.status = "running";

      await battle.save();

      io.to(battleId).emit(
        "battleStarted",
        battle
      );

      console.log(
        `Battle ${battleId} started`
      );

    } catch (error) {

      console.error(error);

    }

  }
);

    // ----------------------------
    // DISCONNECT
    // ----------------------------

    socket.on("disconnect", () => {

      console.log(
        "Battle Socket Disconnected:",
        socket.id
      );

    });

  });

};

export default battleSocket;