import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { code, language, input } = req.body;

    const languageMap = {
      javascript: 63,
      python: 71,
      cpp: 54,
      java: 62,
      typescript: 74,
    };

    const languageId = languageMap[language];

    if (!languageId) {
      return res.status(400).json({
        output: "Unsupported language.",
      });
    }
   

    const response = await axios.post(
      "https://ce.judge0.com/submissions?wait=true",
      {
        source_code: code,
        language_id: languageId,
        stdin: input || "",
      }
    );

    const result = response.data;
    console.log("STDOUT:");
console.log(JSON.stringify(result.stdout));

    res.json({
  output:
    result.stdout ||
    result.stderr ||
    result.compile_output ||
    result.message ||
    "No Output",

  status: result.status?.description,

  time: result.time,

  memory: result.memory,

  exitCode: result.status?.id,
});
  } catch (error) {
    console.error(
      "Judge0 Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      output: "Error running code",
    });
  }
});

export default router;