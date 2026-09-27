import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    battleId: {
      type: String,
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
      ],
      required: true,
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Submission", submissionSchema);
