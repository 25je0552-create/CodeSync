export const generateLeaderboard = (battle) => {
  if (!battle || !battle.players) return [];

  const sortedPlayers = [...battle.players].sort((a, b) => {
    // Primary: Score DESC
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Secondary: Number of solved problems DESC
    const solvedA = a.solved ? a.solved.length : 0;
    const solvedB = b.solved ? b.solved.length : 0;
    if (solvedB !== solvedA) {
      return solvedB - solvedA;
    }
    // Tertiary: Last submission time ASC (earlier submission wins tie)
    if (a.lastSubmissionAt && b.lastSubmissionAt) {
      return new Date(a.lastSubmissionAt) - new Date(b.lastSubmissionAt);
    }
    if (a.lastSubmissionAt) return -1;
    if (b.lastSubmissionAt) return 1;

    return 0;
  });

  return sortedPlayers.map((player, index) => ({
    rank: index + 1,
    username: player.username,
    score: player.score || 0,
    solvedCount: player.solved ? player.solved.length : 0,
    ready: player.ready,
    connected: player.connected !== false,
  }));
};
