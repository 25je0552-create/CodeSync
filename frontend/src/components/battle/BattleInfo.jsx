function BattleInfo({ battle }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8">
      <h1 className="text-4xl font-bold">
        ⚔ {battle.battleName}
      </h1>

      <div className="grid grid-cols-5 gap-6 mt-8">
        <div>
          <p className="text-slate-500 text-sm">Battle ID</p>
          <h3 className="font-semibold mt-1">{battle.battleId}</h3>
        </div>

        <div>
          <p className="text-slate-500 text-sm">Difficulty</p>
          <h3 className="font-semibold mt-1">{battle.difficulty}</h3>
        </div>

        <div>
          <p className="text-slate-500 text-sm">Languages</p>
          <h3 className="font-semibold mt-1">
            {battle.languages.join(", ")}
          </h3>
        </div>

        <div>
          <p className="text-slate-500 text-sm">Duration</p>
          <h3 className="font-semibold mt-1">
            {battle.duration} min
          </h3>
        </div>

        <div>
          <p className="text-slate-500 text-sm">Capacity</p>
          <h3 className="font-semibold mt-1">
            {battle.playerCapacity}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default BattleInfo;