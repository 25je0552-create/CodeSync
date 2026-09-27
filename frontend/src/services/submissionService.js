import axios from "axios";

export const submitSolutionService = async ({
  battleId,
  problemId,
  username,
  language,
  code,
}) => {
  const response = await axios.post(
    "http://localhost:5000/api/submission",
    { battleId, problemId, username, language, code },
    { withCredentials: true }
  );
  return response.data;
};
