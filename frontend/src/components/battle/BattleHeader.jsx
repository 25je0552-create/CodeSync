function BattleHeader() {
  return (
    <div>
      <div className="inline-block border border-[#262626] bg-[#0d0d0d] px-4 py-1.5 font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#cccccc] mb-4">
        ARENA CONFIGURATION
      </div>
      <h1 className="font-bugatti-display text-4xl sm:text-5xl tracking-[3px] text-white uppercase">
        CREATE BATTLE
      </h1>
      <p className="font-bugatti-serif text-xl text-[#cccccc] mt-3">
        Configure rules, constraints, and player capacity for the duel.
      </p>
    </div>
  );
}

export default BattleHeader;