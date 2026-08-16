function BattleNameInput({ battleName, setBattleName }) {
  return (
    <div>
      <label className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] block mb-2">
        BATTLE NAME
      </label>
      <input
        type="text"
        value={battleName}
        onChange={(e) => setBattleName(e.target.value)}
        placeholder="Enter battle name..."
        className="bugatti-input"
      />
    </div>
  );
}

export default BattleNameInput;