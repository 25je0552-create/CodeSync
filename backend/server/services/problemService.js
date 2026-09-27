import Problem from "../models/Problem.js";

export const getProblemById = async (problemId) => {
  return await Problem.findById(problemId);
};

export const searchProblemsService = async ({ difficulty, search }) => {
  const query = {};

  // Handle single difficulty or multi-difficulty array
  if (difficulty) {
    let diffList = [];
    if (Array.isArray(difficulty)) {
      diffList = difficulty;
    } else if (typeof difficulty === "string" && difficulty.trim() !== "") {
      diffList = difficulty.split(",").map((d) => d.trim());
    }

    // Filter out "mixed" / "all"
    diffList = diffList.filter(
      (d) => d && d.toLowerCase() !== "mixed" && d.toLowerCase() !== "all"
    );

    if (diffList.length > 0) {
      // Case-insensitive matching for each difficulty in array
      const regexList = diffList.map((d) => new RegExp(`^${d}$`, "i"));
      query.difficulty = { $in: regexList };
    }
  }

  // Handle text search query (title, description, tags)
  if (search && typeof search === "string" && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { tags: searchRegex },
    ];
  }

  return await Problem.find(query)
    .select(
      "title slug difficulty tags constraints examples inputFormat outputFormat executionMode supportedLanguages starterCode"
    )
    .sort({ difficulty: 1, title: 1 });
};
