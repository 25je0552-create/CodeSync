function TimerSelector({
  duration,
  setDuration,
}) {
  const durations = [
    10,
    20,
    30,
    45,
    60,
    90,
  ];

  return (
    <select
      value={duration}
      onChange={(e) =>
        setDuration(Number(e.target.value))
      }
      className="
        w-full
        bg-white
        border
        border-slate-300
        rounded-xl
        px-4
        py-3
        outline-none
        focus:border-blue-600
      "
    >
      {durations.map((time) => (
        <option
          key={time}
          value={time}
        >
          {time} Minutes
        </option>
      ))}
    </select>
  );
}

export default TimerSelector;