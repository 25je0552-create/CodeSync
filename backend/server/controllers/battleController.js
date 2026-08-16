import Battle from "../models/Battle.js";

const generateBattleId = () => {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
};

export const createBattle = async (
  req,
  res
) => {
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
} = req.body;
    // Basic Validation

    if (!battleName) {
      return res.status(400).json({
        message: "Battle name is required",
      });
    }

    if (
      !languages ||
      languages.length === 0
    ) {
      return res.status(400).json({
        message:
          "Select at least one language",
      });
    }

    const battleId = generateBattleId();

    const battle = new Battle({
      battleId,

      battleName,

      host,

      difficulty,

      languages,

      duration,

      playerCapacity,

      battleType,

      allowSpectators,

      players: [
        {
          username: host,
          ready: false,
          score: 0,
        },
      ],
    });

    await battle.save();

    res.status(201).json({
      success: true,
      battleId,
      battle,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to create battle.",
    });
  }
};
export const getBattle = async (req, res) => {
  try {

    const { battleId } = req.params;

    const battle = await Battle.findOne({ battleId });

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    res.status(200).json({
      success: true,
      battle,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const joinBattle = async (req, res) => {

  try {

    const {

      battleId,

      username,

    } = req.body;

    const battle = await Battle.findOne({
      battleId,
    });

    if (!battle) {

      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });

    }

    if (battle.status !== "waiting") {

  return res.status(400).json({

    success: false,

    message: "Battle already started",

  });

}

    if (
      battle.players.length >=
      battle.playerCapacity
    ) {

      return res.status(400).json({
        success: false,
        message: "Battle is full",
      });

    }

    const alreadyJoined =
      battle.players.some(
        player =>
          player.username === username
      );

    if (!alreadyJoined) {

      battle.players.push({

  username,

  ready: false,

  score: 0,

  language: "",

});
      await battle.save();

    }

    res.status(200).json({

      success: true,

      battle,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};