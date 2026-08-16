function SpectatorToggle({ allowSpectators, setAllowSpectators }) {
  return (
    <div className="flex items-center justify-between bg-[#000000] border border-[#262626] p-4">
      <span className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#cccccc]">
        SPECTATOR OBSERVATION MODE
      </span>

      <button
        type="button"
        onClick={() => setAllowSpectators(!allowSpectators)}
        className={`
          px-4
          py-1.5
          font-bugatti-mono
          text-xs
          uppercase
          tracking-[2px]
          border
          transition-all
          cursor-pointer
          ${
            allowSpectators
              ? "bg-white text-black border-white"
              : "bg-transparent text-[#666666] border-[#262626]"
          }
        `}
      >
        {allowSpectators ? "ENABLED" : "DISABLED"}
      </button>
    </div>
  );
}

export default SpectatorToggle;