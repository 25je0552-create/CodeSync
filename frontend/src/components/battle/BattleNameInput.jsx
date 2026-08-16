function BattleNameInput({
  battleName,
  setBattleName,
}) {
  return (
    <div>

      <label
        className="
        block
        text-sm
        font-semibold
        text-slate-700
        mb-3
        "
      >
        Battle Name
      </label>

      <input
        type="text"
        value={battleName}
        onChange={(e) =>
          setBattleName(e.target.value)
        }
        placeholder="Enter battle name..."
        className="
        w-full
        border
        border-slate-300
        rounded-xl
        px-4
        py-4
        outline-none
        focus:border-blue-600
        "
      />

    </div>
  );
}

export default BattleNameInput;