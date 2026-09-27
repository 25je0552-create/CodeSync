import {
  getProblemById,
  searchProblemsService,
} from "../services/problemService.js";

export const getProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await getProblemById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Get Problem Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const searchProblems = async (req, res) => {
  try {
    const { difficulty, search } = req.query;

    const problems = await searchProblemsService({ difficulty, search });

    res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    console.error("Search Problems Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
