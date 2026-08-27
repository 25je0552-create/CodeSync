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
    solved: {
      type: [String],
      default: [],
    },
    submissions: {
      type: [String],
      default: [],
    },
    lastSubmissionAt: {
      type: Date,
      default: null,
    },
    finished: {
      type: Boolean,
      default: false,
    },
    connected: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const battleProblemSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
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
    problemSelectionMode: {
      type: String,
      enum: ["random", "selected"],
      default: "random",
    },
    numberOfProblems: {
      type: Number,
      default: 1,
    },
    problems: {
      type: [battleProblemSchema],
      default: [],
    },
    players: {
      type: [playerSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["waiting", "running", "finished"],
      default: "waiting",
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Battle", battleSchema);