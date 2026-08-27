import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import BattleHeader from "../components/battle/BattleHeader";
import BattleNameInput from "../components/battle/BattleNameInput";
import DifficultyToggle from "../components/battle/DifficultyToggle";
import LanguageSelector from "../components/battle/LanguageSelector";
import TimerSelector from "../components/battle/TimerSelector";
import PlayerCapacity from "../components/battle/PlayerCapacity";
import BattleType from "../components/battle/BattleType";
import SpectatorToggle from "../components/battle/SpectatorToggle";
import {
  createBattleService,
  searchProblemsService,
} from "../services/battleService";

function BattleSettings() {
  const navigate = useNavigate();

  const [battleName, setBattleName] = useState("");
  const [difficulty, setDifficulty] = useState(["easy"]); // Multi-select array e.g. ["easy", "medium"]
  const [languages, setLanguages] = useState(["cpp"]);
  const [duration, setDuration] = useState(30);
  const [playerCapacity, setPlayerCapacity] = useState(2);
  const [battleType, setBattleType] = useState("private");
  const [allowSpectators, setAllowSpectators] = useState(false);

  // Problem Selection Mode
  const [problemSelectionMode, setProblemSelectionMode] = useState("random"); // "random" | "selected"
  const [numberOfProblems, setNumberOfProblems] = useState(1);

  // Mode B: Problem Search & List
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProblemIds, setSelectedProblemIds] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (problemSelectionMode !== "selected") return;

    let isMounted = true;
    const fetchSearch = async () => {
      try {
        setSearching(true);
        // Pass difficulty array to API
        const res = await searchProblemsService({
          difficulty: Array.isArray(difficulty) ? difficulty.join(",") : difficulty,
          search: searchQuery,
        });
        if (isMounted && res.success) {
          setSearchResults(res.problems || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        if (isMounted) setSearching(false);
      }
    };

    const timer = setTimeout(fetchSearch, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [difficulty, searchQuery, problemSelectionMode]);

  const toggleSelectProblem = (id) => {
    if (selectedProblemIds.includes(id)) {
      setSelectedProblemIds(selectedProblemIds.filter((pId) => pId !== id));
    } else {
      setSelectedProblemIds([...selectedProblemIds, id]);
    }
  };

  const handleCreate = async () => {
    if (!battleName.trim()) {
      toast.error("Enter a battle name.");
      return;
    }

    if (languages.length === 0) {
      toast.error("Select at least one language.");
      return;
    }

    if (
      problemSelectionMode === "selected" &&
      selectedProblemIds.length === 0
    ) {
      toast.error("Select at least one problem from the list.");
      return;
    }

    try {
      const host = localStorage.getItem("username");

      const response = await createBattleService({
        battleName,
        difficulty,
        languages,
        duration,
        playerCapacity,
        battleType,
        allowSpectators,
        host,
        problemSelectionMode,
        numberOfProblems:
          problemSelectionMode === "selected"
            ? selectedProblemIds.length
            : numberOfProblems,
        selectedProblemIds,
      });

      toast.success("Battle Created!");

      const { battleId, battle } = response;
      navigate(`/battle/lobby/${battleId}`, { state: battle });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create battle.");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* NAVBAR */}
      <header className="h-16 border-b border-[#262626] flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/home")}
            className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#999999] hover:text-white transition-colors cursor-pointer"
          >
            ← BACK
          </button>
          <div className="bugatti-wordmark">CODESYNC</div>
        </div>
        <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666]">
          ARENA CONFIGURATION
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto px-8 py-12 flex-1">
        <BattleHeader />

        <div className="mt-10 bg-[#141414] border border-[#262626] p-8 sm:p-10 rounded-none shadow-2xl space-y-10">
          <BattleNameInput battleName={battleName} setBattleName={setBattleName} />

          <div className="space-y-8 border-t border-[#262626] pt-8">
            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-3">
                DIFFICULTY TIERS (MULTI-SELECT)
              </h3>
              <DifficultyToggle difficulty={difficulty} setDifficulty={setDifficulty} />
            </div>

            {/* PROBLEM SELECTION MODE */}
            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-3">
                PROBLEM SELECTION MODE
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setProblemSelectionMode("random")}
                  className={`py-3 font-bugatti-mono text-xs uppercase tracking-[2px] border transition-all cursor-pointer ${
                    problemSelectionMode === "random"
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-[#999999] border-[#262626] hover:border-white hover:text-white"
                  }`}
                >
                  MODE A // RANDOM SELECTION
                </button>
                <button
                  type="button"
                  onClick={() => setProblemSelectionMode("selected")}
                  className={`py-3 font-bugatti-mono text-xs uppercase tracking-[2px] border transition-all cursor-pointer ${
                    problemSelectionMode === "selected"
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-[#999999] border-[#262626] hover:border-white hover:text-white"
                  }`}
                >
                  MODE B // BROWSE & SELECT PROBLEMS
                </button>
              </div>

              {problemSelectionMode === "random" ? (
                <div className="bg-[#000000] border border-[#262626] p-4 flex items-center justify-between font-bugatti-mono">
                  <span className="text-xs text-[#cccccc] uppercase tracking-[1.5px]">
                    NUMBER OF RANDOM PROBLEMS:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={numberOfProblems}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setNumberOfProblems(isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="
                        w-24
                        bg-transparent
                        text-white
                        font-bugatti-mono
                        text-base
                        tracking-[2px]
                        border-b
                        border-[#3a3a3a]
                        focus:border-white
                        outline-none
                        py-1
                        px-2
                      "
                    />
                    <span className="text-xs text-[#999999] uppercase tracking-[1.5px]">
                      PROBLEMS
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#000000] border border-[#262626] p-4 space-y-4">
                  <div>
                    <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666] block mb-2">
                      SEARCH / BROWSE PROBLEMS
                    </label>
                    <input
                      type="text"
                      placeholder="Type to filter by problem title, tag, or topic (leave empty to view all)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bugatti-input text-sm"
                    />
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pt-2 border-t border-[#262626]">
                    {searching ? (
                      <div className="font-bugatti-mono text-xs text-[#666666]">
                        FETCHING PROBLEMS...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="font-bugatti-mono text-xs text-[#666666]">
                        NO MATCHING PROBLEMS FOUND.
                      </div>
                    ) : (
                      searchResults.map((prob) => {
                        const isChecked = selectedProblemIds.includes(prob._id);
                        return (
                          <div
                            key={prob._id}
                            onClick={() => toggleSelectProblem(prob._id)}
                            className={`p-3.5 border flex items-center justify-between cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-[#141414] border-white text-white"
                                : "bg-transparent border-[#262626] text-[#999999] hover:border-[#3a3a3a]"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-bugatti-mono text-xs font-semibold uppercase tracking-[1.5px]">
                                  {prob.title}
                                </span>
                                <span className="font-bugatti-mono text-[10px] uppercase tracking-[1px] border border-[#262626] px-2 py-0.5 text-[#5fa657]">
                                  {prob.difficulty}
                                </span>
                              </div>
                              <p className="font-bugatti-mono text-[10px] text-[#666666] tracking-[1px] uppercase mt-1">
                                TAGS: {prob.tags?.join(", ")}
                              </p>
                            </div>
                            <span className="font-bugatti-mono text-xs tracking-[1.5px] uppercase font-semibold">
                              {isChecked ? "[✓ SELECTED]" : "[+] SELECT"}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="font-bugatti-mono text-[10px] uppercase tracking-[1.5px] text-[#666666] text-right">
                    SELECTED PROBLEMS: {selectedProblemIds.length}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-3">
                PERMITTED LANGUAGES
              </h3>
              <LanguageSelector languages={languages} setLanguages={setLanguages} />
            </div>

            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-3">
                BATTLE DURATION
              </h3>
              <TimerSelector duration={duration} setDuration={setDuration} />
            </div>

            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-3">
                PLAYER CAPACITY
              </h3>
              <PlayerCapacity
                playerCapacity={playerCapacity}
                setPlayerCapacity={setPlayerCapacity}
              />
            </div>

            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-3">
                ARENA ACCESS TYPE
              </h3>
              <BattleType battleType={battleType} setBattleType={setBattleType} />
            </div>

            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-3">
                SPECTATOR PRIVILEGES
              </h3>
              <SpectatorToggle
                allowSpectators={allowSpectators}
                setAllowSpectators={setAllowSpectators}
              />
            </div>
          </div>

          <div className="pt-8 border-t border-[#262626] space-y-4">
            <button onClick={handleCreate} className="bugatti-button-primary w-full text-center">
              CREATE BATTLE ARENA
            </button>

            <button
              onClick={() => navigate("/battle/join")}
              className="bugatti-button-secondary w-full text-center"
            >
              JOIN EXISTING BATTLE
            </button>
          </div>
        </div>
      </main>

      <footer className="h-16 border-t border-[#262626] flex items-center justify-between px-8 text-[#666666] font-bugatti-mono text-[11px] tracking-[2px] uppercase">
        <div>© CODESYNC AUTOMOTIVE LUXURY UI</div>
        <div>ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}

export default BattleSettings;