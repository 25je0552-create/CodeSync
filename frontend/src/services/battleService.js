import axios from "axios";

const API_BASE = "http://localhost:5000/api/battle";
const PROBLEM_API_BASE = "http://localhost:5000/api/problem";

export const createBattleService = async (battleData) => {
  const response = await axios.post(`${API_BASE}/create`, battleData, {
    withCredentials: true,
  });
  return response.data;
};

export const getBattleService = async (battleId) => {
  const response = await axios.get(`${API_BASE}/${battleId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const joinBattleService = async (battleId, username) => {
  const response = await axios.post(
    `${API_BASE}/join`,
    { battleId, username },
    { withCredentials: true }
  );
  return response.data;
};

export const startBattleService = async (battleId, username) => {
  const response = await axios.post(
    `${API_BASE}/${battleId}/start`,
    { battleId, username },
    { withCredentials: true }
  );
  return response.data;
};

export const leaveBattleService = async (battleId, username) => {
  const response = await axios.post(
    `${API_BASE}/${battleId}/leave`,
    { battleId, username },
    { withCredentials: true }
  );
  return response.data;
};

export const searchProblemsService = async ({ difficulty, search }) => {
  const response = await axios.get(`${PROBLEM_API_BASE}/search`, {
    params: { difficulty, search },
    withCredentials: true,
  });
  return response.data;
};

export const getLeaderboardService = async (battleId) => {
  const response = await axios.get(`${API_BASE}/${battleId}/leaderboard`, {
    withCredentials: true,
  });
  return response.data;
};
