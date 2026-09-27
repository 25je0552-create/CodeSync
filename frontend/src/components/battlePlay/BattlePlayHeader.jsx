import { useNavigate } from "react-router-dom";

function BattlePlayHeader({
  battle,
  username = "Player",
  activeProblemIndex = 0,
  setActiveProblemIndex = () => {},
  timeRemaining = "30:00",
}) {
  const navigate = useNavigate();

  if (!battle) {
    return (
      <div className="bg-[#141414] border border-[#262626] p-6 font-bugatti-mono text-xs text-[#999999]">
        LOADING ARENA DATA...
      </div>
    );
  }

  const problems = Array.isArray(battle.problems) ? battle.problems : [];

  const formattedDifficulty = Array.isArray(battle.difficulty)
    ? battle.difficulty.join(", ").toUpperCase()
    : typeof battle.difficulty === "string"
    ? battle.difficulty.toUpperCase()
    : "EASY";

  const formattedStatus = typeof battle.status === "string"
    ? battle.status.toUpperCase()
    : "RUNNING";

  return (
    <div className="sticky top-0 bg-[#141414] border border-[#262626] p-6 rounded-none z-30 shadow-2xl space-y-6">
      {/* Top Row: Navigation, Arena Details, Player Tag, Sticky Timer */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => navigate("/battle")}
            className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#999999] hover:text-white transition-colors cursor-pointer"
          >
            ← EXIT ARENA
          </button>
          <div>
            <div className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
              ACTIVE ARENA MATCH // {battle.battleId}
            </div>
            <h1 className="font-bugatti-display text-3xl tracking-[3px] text-white uppercase mt-0.5">
              {battle.battleName || "ARENA DUEL"}
            </h1>
          </div>
        </div>

        {/* Center/Right Info: User Tag + Countdown Timer + Match Status */}
        <div className="flex items-center gap-5 ml-auto">
          {/* USERNAME BADGE */}
          <div className="bg-[#000000] border border-[#262626] px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#5fa657]" />
            <div className="text-left font-bugatti-mono">
              <span className="text-[9px] uppercase tracking-[2px] text-[#666666] block">
                PLAYER // IDENTITY
              </span>
              <span className="text-xs uppercase tracking-[1.5px] text-white font-semibold">
                {username}
              </span>
            </div>
          </div>

          {/* STICKY COUNTDOWN TIMER */}
          <div className="bg-[#000000] border border-[#262626] px-5 py-2 flex flex-col items-center">
            <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
              TIME REMAINING
            </span>
            <span className="font-bugatti-mono text-2xl tracking-[2px] text-white font-semibold">
              ⏱ {timeRemaining}
            </span>
          </div>

          <div className="hidden sm:block text-right font-bugatti-mono">
            <div className="text-xs uppercase tracking-[2px] text-[#5fa657]">
              STATUS // {formattedStatus}
            </div>
            <div className="text-[10px] text-[#666666] uppercase tracking-[1px] mt-1">
              HOST: {battle.host || "ANONYMOUS"}
            </div>
          </div>
        </div>
      </div>

      {/* Problem Navigation Tabs */}
      {problems.length > 0 && (
        <div className="border-t border-[#262626] pt-4 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5 overflow-x-auto pr-6">
            <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666] mr-2 shrink-0">
              PROBLEMS:
            </span>
            {problems.map((p, idx) => {
              const probObj =
                p.problemId && typeof p.problemId === "object" ? p.problemId : p;
              const probTitle = probObj.title || `Q${idx + 1}`;
              const isSelected = activeProblemIndex === idx;
              return (
                <button
                  key={probObj._id || idx}
                  type="button"
                  onClick={() => setActiveProblemIndex(idx)}
                  className={`
                    px-4
                    py-2
                    font-bugatti-mono
                    text-xs
                    uppercase
                    tracking-[1.5px]
                    border
                    transition-all
                    cursor-pointer
                    shrink-0
                    ${
                      isSelected
                        ? "bg-white text-black border-white"
                        : "bg-[#000000] text-[#999999] border-[#262626] hover:border-[#3a3a3a] hover:text-white"
                    }
                  `}
                >
                  PROBLEM {idx + 1}: {probTitle}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3 font-bugatti-mono text-[11px] uppercase tracking-[1.5px] text-[#999999] shrink-0 pl-8 border-l border-[#262626] whitespace-nowrap">
            <span>DIFFICULTY: {formattedDifficulty}</span>
            <span className="text-[#3a3a3a]">·</span>
            <span>CAPACITY: {battle.players?.length || 0}/{battle.playerCapacity || 2}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BattlePlayHeader;