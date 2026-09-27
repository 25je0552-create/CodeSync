import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    points: { type: Number, default: 10 },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Expert"],
      required: true,
    },
    tags: { type: [String], default: [] },
    examples: { type: [exampleSchema], default: [] },
    constraints: { type: [String], default: [] },
    inputFormat: { type: String, default: "" },
    outputFormat: { type: String, default: "" },
    executionMode: {
      type: String,
      enum: ["stdin", "function"],
      default: "stdin",
    },
    supportedLanguages: {
      type: [String],
      default: ["cpp", "python", "java", "javascript", "c"],
    },
    starterCode: {
      cpp: { type: String, default: "" },
      python: { type: String, default: "" },
      java: { type: String, default: "" },
      javascript: { type: String, default: "" },
      c: { type: String, default: "" },
      typescript: { type: String, default: "" },
    },
    testCases: { type: [testCaseSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);
