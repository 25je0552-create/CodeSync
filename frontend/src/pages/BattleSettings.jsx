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

  const [difficulty, setDifficulty] =
    useState("easy");

  const [languages, setLanguages] = useState([
    "cpp",
  ]);

  const [duration, setDuration] =
    useState(30);

  const [playerCapacity, setPlayerCapacity] =
    useState(2);

  const [battleType, setBattleType] =
    useState("private");

  const [allowSpectators, setAllowSpectators] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FB]">

      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* Header */}

        <BattleHeader />

        {/* Main Card */}

        <div
          className="
          mt-10
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          p-8
          "
        >

          {/* Battle Name */}

          <BattleNameInput
            battleName={battleName}
            setBattleName={setBattleName}
          />

          <div className="space-y-8 mt-8">

            {/* Difficulty */}

            <div>

              <h3 className="font-semibold text-slate-700 mb-3">
                Difficulty
              </h3>

              <DifficultyToggle
                difficulty={difficulty}
                setDifficulty={setDifficulty}
              />

            </div>

            {/* Languages */}

            <div>

              <h3 className="font-semibold text-slate-700 mb-3">
                Available Languages
              </h3>

              <LanguageSelector
                languages={languages}
                setLanguages={setLanguages}
              />

            </div>

            {/* Duration */}

            <div>

              <h3 className="font-semibold text-slate-700 mb-3">
                Battle Duration
              </h3>

              <TimerSelector
                duration={duration}
                setDuration={setDuration}
              />

            </div>

            {/* Player Capacity */}

            <div>

              <h3 className="font-semibold text-slate-700 mb-3">
                Player Capacity
              </h3>

              <PlayerCapacity
                playerCapacity={playerCapacity}
                setPlayerCapacity={setPlayerCapacity}
              />

            </div>

            {/* Battle Type */}

            <div>

              <h3 className="font-semibold text-slate-700 mb-3">
                Battle Type
              </h3>

              <BattleType
                battleType={battleType}
                setBattleType={setBattleType}
              />

            </div>

            {/* Spectators */}

            <div>

              <h3 className="font-semibold text-slate-700 mb-3">
                Allow Spectators
              </h3>

              <SpectatorToggle
                allowSpectators={allowSpectators}
                setAllowSpectators={setAllowSpectators}
              />

            </div>

          </div>

          {/* Action Buttons */}

          <div className="mt-10 space-y-4">

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
              onClick={() =>
                navigate("/battle/join")
              }
              className="
              w-full
              py-4
              rounded-xl
              border
              border-slate-300
              bg-white
              hover:bg-slate-100
              text-slate-700
              font-semibold
              text-lg
              transition
              "
            >
            Join Existing Battle
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BattleSettings;