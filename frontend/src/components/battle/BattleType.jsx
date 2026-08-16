function BattleType({ battleType, setBattleType }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => setBattleType("private")}
        className={`
          py-3
          font-bugatti-mono
          text-xs
          uppercase
          tracking-[2px]
          border
          rounded-none
          transition-all
          cursor-pointer
          ${
            battleType === "private"
              ? "bg-white text-black border-white"
              : "bg-transparent text-[#999999] border-[#262626] hover:border-[#3a3a3a] hover:text-white"
          }
        `}
      >
        PRIVATE ARENA
      </button>

      <button
        type="button"
        onClick={() => setBattleType("public")}
        className={`
          py-3
          font-bugatti-mono
          text-xs
          uppercase
          tracking-[2px]
          border
          rounded-none
          transition-all
          cursor-pointer
          ${
            battleType === "public"
              ? "bg-white text-black border-white"
              : "bg-transparent text-[#999999] border-[#262626] hover:border-[#3a3a3a] hover:text-white"
          }
        `}
      >
        PUBLIC MATCH
      </button>
    </div>
  );
}

export default BattleType;