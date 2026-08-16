function BattleInfo({ battle }) {
  return (
    <div className="bg-[#141414] border border-[#262626] p-8 rounded-none">
      <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-2">
        ARENA LOBBY
      </div>
      <h1 className="font-bugatti-display text-4xl tracking-[3px] text-white uppercase">
        {battle.battleName}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mt-8 pt-6 border-t border-[#262626]">
        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            BATTLE ID
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white mt-1">
            {battle.battleId}
          </h3>
        </div>

        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            DIFFICULTY
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white mt-1 uppercase">
            {battle.difficulty}
          </h3>
        </div>

        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            LANGUAGES
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white mt-1 uppercase">
            {battle.languages.join(", ")}
          </h3>
        </div>

        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            DURATION
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white mt-1">
            {battle.duration} MIN
          </h3>
        </div>

        <div>
          <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
            CAPACITY
          </p>
          <h3 className="font-bugatti-mono text-sm tracking-[1.5px] text-white mt-1">
            {battle.players.length} / {battle.playerCapacity}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default BattleInfo;