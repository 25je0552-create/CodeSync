function SpectatorToggle({
  allowSpectators,
  setAllowSpectators,
}) {
  return (
    <div
      className="
      flex
      items-center
      justify-between
      bg-slate-100
      rounded-xl
      px-5
      py-3
      "
    >
      <span className="font-medium text-slate-700">
        Allow Spectators
      </span>

      <button
        onClick={() =>
          setAllowSpectators(
            !allowSpectators
          )
        }
        className={`
          w-14
          h-8
          rounded-full
          transition
          relative

          ${
            allowSpectators
              ? "bg-blue-600"
              : "bg-slate-300"
          }
        `}
      >
        <div
          className={`
            absolute
            top-1
            w-6
            h-6
            bg-white
            rounded-full
            transition-all

            ${
              allowSpectators
                ? "right-1"
                : "left-1"
            }
          `}
        />
      </button>

    </div>
  );
}

export default SpectatorToggle;