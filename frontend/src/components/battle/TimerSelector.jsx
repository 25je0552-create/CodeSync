function TimerSelector({ duration, setDuration }) {
  const durations = [10, 20, 30, 45, 60, 90];

  return (
    <select
      value={duration}
      onChange={(e) => setDuration(Number(e.target.value))}
      className="
        w-full
        bg-[#141414]
        text-white
        font-bugatti-mono
        text-xs
        uppercase
        tracking-[1.5px]
        border
        border-[#262626]
        focus:border-white
        px-4
        py-3
        outline-none
        rounded-none
        cursor-pointer
      "
    >
      {durations.map((time) => (
        <option key={time} value={time}>
          {time} MINUTES
        </option>
      ))}
    </select>
  );
}

export default TimerSelector;