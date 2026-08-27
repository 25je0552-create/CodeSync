function TimerSelector({ duration, setDuration }) {
  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setDuration(1);
    } else {
      setDuration(val);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-[#000000] border border-[#262626] p-4 font-bugatti-mono">
      <span className="text-xs uppercase tracking-[2px] text-[#666666]">
        DURATION (MINUTES):
      </span>
      <input
        type="number"
        min="1"
        max="180"
        value={duration}
        onChange={handleChange}
        className="
          w-32
          bg-transparent
          text-white
          font-bugatti-mono
          text-base
          tracking-[2px]
          border-b
          border-[#3a3a3a]
          focus:border-white
          outline-none
          py-1
          px-2
        "
      />
      <span className="text-xs text-[#999999] uppercase tracking-[1.5px]">
        MIN
      </span>
    </div>
  );
}

export default TimerSelector;