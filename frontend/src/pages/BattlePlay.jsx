import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import BattlePlayHeader from "../components/battlePlay/BattlePlayHeader";
import ProblemPanel from "../components/battlePlay/ProblemPanel";
import Leaderboard from "../components/battlePlay/Leaderboard";
import BattleEditor from "../components/battlePlay/BattleEditor";
import BattleTerminal from "../components/battlePlay/BattleTerminal";
import BottomToolbar from "../components/battlePlay/BottomToolbar";

import {
  getBattleService,
  getLeaderboardService,
  searchProblemsService,
} from "../services/battleService";
import battleSocket from "../socket/battleSocket";

function BattlePlay() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Player";

  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Multi-Problem & Code Persistence State
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [codeMap, setCodeMap] = useState({}); // { [problemId]: { [lang]: codeString } }
  const [fallbackProblems, setFallbackProblems] = useState([]);

  // Custom Stdin, Output, & Results State
  const [customInput, setCustomInput] = useState("");
  const [executionOutput, setExecutionOutput] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);

  // Execution & Submission Flags
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Real-time Leaderboard State
  const [leaderboard, setLeaderboard] = useState([]);

  // Timer Countdown State
  const [timeRemaining, setTimeRemaining] = useState("--:--");

  // Fetch initial battle & leaderboard
  const loadBattleData = useCallback(async () => {
    if (!battleId) return;

    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getBattleService(battleId);

      if (data && data.success && data.battle) {
        setBattle(data.battle);
        if (data.battle.languages && data.battle.languages.length > 0) {
          setSelectedLanguage(data.battle.languages[0]);
        }

        // If problems is empty or missing, fetch fallbacks
        if (!data.battle.problems || data.battle.problems.length === 0) {
          try {
            const probRes = await searchProblemsService({ difficulty: "", search: "" });
            if (probRes.success && probRes.problems) {
              setFallbackProblems(probRes.problems.slice(0, 2));
            }
          } catch (e) {
            console.error("Fallback problem fetch error:", e);
          }
        }

        // Initial leaderboard load
        try {
          const lbData = await getLeaderboardService(battleId);
          if (lbData && lbData.success) {
            setLeaderboard(lbData.leaderboard || []);
          }
        } catch (err) {
          console.error("Leaderboard fetch error:", err);
        }
      } else {
        setErrorMsg("Battle data not found.");
      }
    } catch (error) {
      console.error("Fetch Battle Error:", error);
      setErrorMsg(error.response?.data?.message || "Failed to load battle details.");
    } finally {
      setLoading(false);
    }
  }, [battleId]);

  useEffect(() => {
    loadBattleData();
  }, [loadBattleData]);

  // Socket Event Subscriptions
  useEffect(() => {
    if (!battleId || !username) return;

    battleSocket.emit("joinBattle", { battleId, username });

    const handleBattleUpdated = (updatedBattle) => {
      if (updatedBattle && updatedBattle.battleId === battleId) {
        setBattle(updatedBattle);
      }
    };

    const handleLeaderboardUpdated = (newLeaderboard) => {
      if (Array.isArray(newLeaderboard)) {
        setLeaderboard(newLeaderboard);
      }
    };

    const handleBattleFinished = () => {
      toast.success("Battle match has concluded!");
    };

    battleSocket.on("battleUpdated", handleBattleUpdated);
    battleSocket.on("leaderboardUpdated", handleLeaderboardUpdated);
    battleSocket.on("battleFinished", handleBattleFinished);

    return () => {
      battleSocket.off("battleUpdated", handleBattleUpdated);
      battleSocket.off("leaderboardUpdated", handleLeaderboardUpdated);
      battleSocket.off("battleFinished", handleBattleFinished);
    };
  }, [battleId, username]);

  // Authoritative Server Timer Countdown
  useEffect(() => {
    if (!battle?.endTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(battle.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("00:00");
        clearInterval(interval);
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        const formatMins = mins < 10 ? `0${mins}` : `${mins}`;
        const formatSecs = secs < 10 ? `0${secs}` : `${secs}`;
        setTimeRemaining(`${formatMins}:${formatSecs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [battle?.endTime]);

  // Active Problem resolution
  const problemList = useMemo(() => {
    if (battle?.problems && battle.problems.length > 0) {
      return battle.problems.map((p, idx) => {
        if (p.problemId && typeof p.problemId === "object") {
          return p.problemId;
        }
        return {
          _id: p.problemId || `problem-${idx}`,
          title: `Problem ${idx + 1}`,
          difficulty: battle.difficulty || "Easy",
          description: "Loading problem specifications...",
          constraints: [],
          examples: [],
        };
      });
    }
    return fallbackProblems;
  }, [battle, fallbackProblems]);

  const activeProblem = useMemo(() => {
    if (problemList.length === 0) return null;
    return problemList[activeProblemIndex] || problemList[0] || null;
  }, [problemList, activeProblemIndex]);

  // Code getter & setter with per-problem & per-language persistence
  const currentCode = useMemo(() => {
    if (!activeProblem) return "// Loading starter code...";
    const probId = activeProblem._id || "default";

    // 1. Check codeMap override
    if (
      codeMap[probId] &&
      codeMap[probId][selectedLanguage] !== undefined
    ) {
      return codeMap[probId][selectedLanguage];
    }

    // 2. Check problem starterCode
    if (
      activeProblem.starterCode &&
      activeProblem.starterCode[selectedLanguage]
    ) {
      return activeProblem.starterCode[selectedLanguage];
    }

    return `// Write your ${selectedLanguage} solution for ${activeProblem.title || "this problem"} here...\n`;
  }, [activeProblem, selectedLanguage, codeMap]);

  const handleCodeChange = (newCode) => {
    if (!activeProblem) return;
    const probId = activeProblem._id || "default";

    setCodeMap((prev) => ({
      ...prev,
      [probId]: {
        ...(prev[probId] || {}),
        [selectedLanguage]: newCode,
      },
    }));
  };

  const handleResetCode = () => {
    if (!activeProblem) return;
    const probId = activeProblem._id || "default";
    const defaultStarter =
      activeProblem.starterCode?.[selectedLanguage] ||
      `// Write your ${selectedLanguage} solution here...\n`;

    setCodeMap((prev) => ({
      ...prev,
      [probId]: {
        ...(prev[probId] || {}),
        [selectedLanguage]: defaultStarter,
      },
    }));
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#000000] font-bugatti-mono text-[#999999] text-xs uppercase tracking-[2.5px] space-y-4">
        <div className="w-8 h-8 border-2 border-[#262626] border-t-white rounded-full animate-spin" />
        <div>LOADING ARENA SESSION // {battleId}</div>
      </div>
    );
  }

  if (errorMsg || !battle) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#000000] font-bugatti-mono text-white text-xs uppercase tracking-[2.5px] space-y-6 px-6">
        <div className="text-[#ff5f57] text-sm">
          {errorMsg || "ARENA SESSION NOT FOUND"}
        </div>
        <div className="flex gap-4">
          <button
            onClick={loadBattleData}
            className="bugatti-button-primary py-2 px-6 cursor-pointer"
          >
            RETRY LOADING
          </button>
          <button
            onClick={() => navigate("/battle")}
            className="bugatti-button-secondary py-2 px-6 cursor-pointer"
          >
            RETURN TO ARENA CONFIG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <main className="max-w-7xl w-full mx-auto px-6 py-6 space-y-6 flex-1">
        {/* Sticky Header with Timer & Multi-Problem Tabs */}
        <BattlePlayHeader
          battle={battle}
          username={username}
          activeProblemIndex={activeProblemIndex}
          setActiveProblemIndex={setActiveProblemIndex}
          timeRemaining={timeRemaining}
        />

        {/* Problem Panel + Realtime Scoreboard */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <ProblemPanel problem={activeProblem} />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Leaderboard leaderboard={leaderboard} />
          </div>
        </div>

        {/* Monaco Editor Component */}
        <BattleEditor
          code={currentCode}
          setCode={handleCodeChange}
          language={selectedLanguage}
          setLanguage={setSelectedLanguage}
          allowedLanguages={battle?.languages}
          onResetCode={handleResetCode}
        />

        {/* Execution & Submission Results Terminal */}
        <BattleTerminal
          programInput={customInput}
          setProgramInput={setCustomInput}
          output={executionOutput}
          submissionResult={submissionResult}
          running={running}
          submitting={submitting}
          onClear={() => {
            setExecutionOutput("");
            setSubmissionResult(null);
          }}
        />

        {/* Bottom Action Toolbar */}
        <BottomToolbar
          code={currentCode}
          language={selectedLanguage}
          battleId={battleId}
          problemId={activeProblem?._id}
          username={username}
          customInput={customInput}
          setOutput={setExecutionOutput}
          setSubmissionResult={setSubmissionResult}
          running={running}
          setRunning={setRunning}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      </main>

      <footer className="h-16 border-t border-[#262626] flex items-center justify-between px-8 text-[#666666] font-bugatti-mono text-[11px] tracking-[2px] uppercase">
        <div>© CODESYNC AUTOMOTIVE LUXURY UI</div>
        <div>ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}

export default BattlePlay;
