import { useEffect, useState } from "react";
import axios from "axios";

function BattlePlayHeader({ battleId }) {
  const [battle, setBattle] = useState(null);

  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/battle/${battleId}`
        );
        setBattle(response.data.battle);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBattle();
  }, [battleId]);

  if (!battle) {
    return (
      <div className="bg-[#141414] border border-[#262626] p-6 font-bugatti-mono text-xs text-[#999999]">
        LOADING ARENA DATA...
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#262626] p-8 rounded-none">
      {/* First Row */}
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666]">
            ACTIVE BATTLE ARENA
          </div>
          <h1 className="font-bugatti-display text-4xl tracking-[3px] text-white uppercase mt-1">
            {battle.battleName}
          </h1>
          <p className="font-bugatti-mono text-xs text-[#999999] tracking-[1.5px] uppercase mt-1">
            KEY: {battle.battleId}
          </p>
        </div>

        <div className="text-right">
          <div className="font-bugatti-mono text-3xl font-normal text-white tracking-[2px]">
            30:00
          </div>
          <div className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#5fa657] mt-1">
            STATUS // {battle.status}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-6 border-t border-[#262626]">
        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            DIFFICULTY
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white uppercase mt-1">
            {battle.difficulty}
          </h3>
        </div>

        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            LANGUAGES
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white uppercase mt-1">
            {battle.languages.join(", ")}
          </h3>
        </div>

        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            PLAYERS
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white uppercase mt-1">
            {battle.players.length} / {battle.playerCapacity}
          </h3>
        </div>

        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            ARENA HOST
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white uppercase mt-1">
            {battle.host}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default BattlePlayHeader;