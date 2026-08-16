import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    ready: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
    },

    language: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const battleSchema = new mongoose.Schema(
  {
    battleId: {
      type: String,
      required: true,
      unique: true,
    },

    battleName: {
      type: String,
      required: true,
    },

    host: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
    },

    languages: {
      type: [String],
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    playerCapacity: {
      type: Number,
      required: true,
    },

    battleType: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    allowSpectators: {
      type: Boolean,
      default: false,
    },

    players: {
      type: [playerSchema],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "running",
        "finished",
      ],
      default: "waiting",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Battle",
  battleSchema
);