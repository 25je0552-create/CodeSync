function PlayerCapacity({
  playerCapacity,
  setPlayerCapacity,
}) {
  const increase = () => {
    if (playerCapacity < 10) {
      setPlayerCapacity(
        playerCapacity + 1
      );
    }
  };

  const decrease = () => {
    if (playerCapacity > 2) {
      setPlayerCapacity(
        playerCapacity - 1
      );
    }
  };

  return (
    <div
      className="
      flex
      items-center
      justify-center
      gap-5
      "
    >
      <button
        onClick={decrease}
        className="
        w-12
        h-12
        rounded-xl
        bg-slate-100
        hover:bg-slate-200
        text-xl
        font-bold
        "
      >
        −
      </button>

      <div
        className="
        w-24
        text-center
        text-2xl
        font-bold
        "
      >
        {playerCapacity}
      </div>

      <button
        onClick={increase}
        className="
        w-12
        h-12
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        text-xl
        font-bold
        "
      >
        +
      </button>
    </div>
  );
}

export default PlayerCapacity;