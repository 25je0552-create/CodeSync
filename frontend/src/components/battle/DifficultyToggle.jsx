function DifficultyToggle({ difficulty, setDifficulty }) {
  const difficulties = [
    { id: "easy", label: "EASY" },
    { id: "medium", label: "MEDIUM" },
    { id: "hard", label: "HARD" },
    { id: "expert", label: "EXPERT" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {difficulties.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setDifficulty(item.id)}
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
              difficulty === item.id
                ? "bg-white text-black border-white"
                : "bg-transparent text-[#999999] border-[#262626] hover:border-[#3a3a3a] hover:text-white"
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default DifficultyToggle;