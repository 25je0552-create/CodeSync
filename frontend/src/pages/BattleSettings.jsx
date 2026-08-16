import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BattleHeader from "../components/battle/BattleHeader";
import BattleNameInput from "../components/battle/BattleNameInput";
import DifficultyToggle from "../components/battle/DifficultyToggle";
import LanguageSelector from "../components/battle/LanguageSelector";
import TimerSelector from "../components/battle/TimerSelector";
import PlayerCapacity from "../components/battle/PlayerCapacity";
import BattleType from "../components/battle/BattleType";
import SpectatorToggle from "../components/battle/SpectatorToggle";
import CreateBattleButton from "../components/battle/CreateBattleButton";

function BattleSettings() {
  const navigate = useNavigate();

  const [battleName, setBattleName] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [languages, setLanguages] = useState(["cpp"]);
  const [duration, setDuration] = useState(30);
  const [playerCapacity, setPlayerCapacity] = useState(2);
  const [battleType, setBattleType] = useState("private");
  const [allowSpectators, setAllowSpectators] = useState(false);

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
                DIFFICULTY TIER
              </h3>
              <DifficultyToggle difficulty={difficulty} setDifficulty={setDifficulty} />
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
            <CreateBattleButton
              battleName={battleName}
              difficulty={difficulty}
              languages={languages}
              duration={duration}
              playerCapacity={playerCapacity}
              battleType={battleType}
              allowSpectators={allowSpectators}
            />

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