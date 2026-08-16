function PlayerCapacity({ playerCapacity, setPlayerCapacity }) {
  const increase = () => {
    if (playerCapacity < 10) {
      setPlayerCapacity(playerCapacity + 1);
    }
  };

  const decrease = () => {
    if (playerCapacity > 2) {
      setPlayerCapacity(playerCapacity - 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 bg-[#000000] border border-[#262626] p-3">
      <button
        type="button"
        onClick={decrease}
        className="w-10 h-10 border border-[#262626] hover:border-white text-white font-bugatti-mono text-lg flex items-center justify-center transition-colors cursor-pointer"
      >
        −
      </button>

      <div className="w-24 text-center font-bugatti-display text-2xl tracking-[2px] text-white">
        {playerCapacity} PLAYERS
      </div>

      <button
        type="button"
        onClick={increase}
        className="w-10 h-10 border border-[#262626] hover:border-white text-white font-bugatti-mono text-lg flex items-center justify-center transition-colors cursor-pointer"
      >
        +
      </button>
    </div>
  );
}

export default PlayerCapacity;