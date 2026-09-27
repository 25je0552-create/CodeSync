import axios from "axios";

export const runCodeService = async ({
  code,
  language,
  input = "",
  testCases = null,
  problemSlug = "",
}) => {
  const response = await axios.post(
    "http://localhost:5000/execute",
    { code, language, input, testCases, problemSlug },
    { withCredentials: true }
  );
  return response.data;
};
