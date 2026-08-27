import toast from "react-hot-toast";

function DifficultyToggle({ difficulty, setDifficulty }) {
  const difficulties = [
    { id: "easy", label: "EASY" },
    { id: "medium", label: "MEDIUM" },
    { id: "hard", label: "HARD" },
  ];

  // Convert difficulty prop to array if string
  const selectedList = Array.isArray(difficulty)
    ? difficulty
    : typeof difficulty === "string" && difficulty
    ? [difficulty.toLowerCase()]
    : ["easy"];

  const toggleDifficulty = (id) => {
    if (selectedList.includes(id)) {
      if (selectedList.length === 1) {
        toast.error("Select at least one difficulty tier.");
        return;
      }
      setDifficulty(selectedList.filter((item) => item !== id));
    } else {
      setDifficulty([...selectedList, id]);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 font-bugatti-mono">
      {difficulties.map((item) => {
        const isSelected = selectedList.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleDifficulty(item.id)}
            className={`
              py-3
              text-xs
              uppercase
              tracking-[2px]
              border
              rounded-none
              transition-all
              cursor-pointer
              ${
                isSelected
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-[#999999] border-[#262626] hover:border-[#3a3a3a] hover:text-white"
              }
            `}
          >
            {item.label} {isSelected ? "✓" : ""}
          </button>
        );
      })}
    </div>
  );
}

export default DifficultyToggle;