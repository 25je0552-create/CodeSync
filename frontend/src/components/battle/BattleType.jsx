function BattleType({
  battleType,
  setBattleType,
}) {
  return (
    <div className="grid grid-cols-2 gap-4">

      <button
        onClick={() =>
          setBattleType("private")
        }
        className={`
          py-3
          rounded-xl
          border
          font-semibold
          transition-all

          ${
            battleType === "private"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-slate-300 text-slate-700 hover:bg-blue-50"
          }
        `}
      >
        🔒 Private
      </button>

      <button
        onClick={() =>
          setBattleType("public")
        }
        className={`
          py-3
          rounded-xl
          border
          font-semibold
          transition-all

          ${
            battleType === "public"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-slate-300 text-slate-700 hover:bg-blue-50"
          }
        `}
      >
        🌍 Public
      </button>

    </div>
  );
}

export default BattleType;