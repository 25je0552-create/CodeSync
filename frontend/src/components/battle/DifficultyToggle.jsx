function DifficultyToggle({
  difficulty,
  setDifficulty,
}) {
  const difficulties = [
    {
      id: "easy",
      label: "Easy",
    },
    {
      id: "medium",
      label: "Medium",
    },
    {
      id: "hard",
      label: "Hard",
    },
    {
      id: "expert",
      label: "Expert",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {difficulties.map((item) => (
        <button
          key={item.id}
          onClick={() =>
            setDifficulty(item.id)
          }
          className={`
            py-3
            rounded-xl
            border
            text-sm
            font-semibold
            transition-all
            duration-200

            ${
              difficulty === item.id
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:bg-blue-50"
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