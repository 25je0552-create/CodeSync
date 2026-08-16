import axios from "axios";

function BottomToolbar({
  code,
  language,
  setOutput,
  running,
  setRunning,
}) {

  // Same endpoint/contract EditorPage.jsx already uses for the regular
  // (non-battle) editor — POST { code, language } -> { output, time, memory }.
  const handleRun = async () => {
    if (running) return;

    try {
      setRunning(true);
      setOutput("");

      const response = await axios.post(
        "http://localhost:5000/execute",
        {
          code,
          language,
        }
      );

      setOutput(response.data.output);
    } catch (error) {
      setOutput(
        error.response?.data?.output ||
          "❌ Execution Failed."
      );
    } finally {
      setRunning(false);
    }
  };

  return (
    <div
      className="
      sticky
      bottom-4
      bg-[#1a1a1a]
      rounded-2xl
      border
      border-slate-800
      shadow-xl
      px-5
      py-4
      flex
      items-center
      justify-between
      gap-4
      "
    >

      {/* Left: contextual hint */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <span
          className={`
            w-1.5
            h-1.5
            rounded-full
            ${running ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}
          `}
        />
        {running ? "Running" : "Ready"}
        <span className="mx-1 text-slate-700">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] border border-slate-700 text-slate-400 text-[10px] font-mono">
            Ctrl
          </kbd>
          +
          <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] border border-slate-700 text-slate-400 text-[10px] font-mono">
            Enter
          </kbd>
          <span className="ml-1">to run</span>
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3 ml-auto">

        <button
          onClick={handleRun}
          disabled={running}
          className="
          flex
          items-center
          gap-2
          bg-[#2a2a2a]
          hover:bg-[#333333]
          text-slate-200
          border
          border-slate-700
          px-5
          py-2.5
          rounded-xl
          font-medium
          text-sm
          transition
          disabled:opacity-60
          disabled:cursor-not-allowed
          "
        >
          <span aria-hidden>{running ? "⏳" : "▶"}</span>
          {running ? "Running..." : "Run Code"}
        </button>

        <button
          title="Not wired up yet"
          className="
          flex
          items-center
          gap-2
          bg-[#2a2a2a]
          hover:bg-[#333333]
          text-purple-300
          border
          border-slate-700
          hover:border-purple-500/50
          px-5
          py-2.5
          rounded-xl
          font-medium
          text-sm
          transition
          "
        >
          <span aria-hidden>🤖</span>
          AI Review
        </button>

        <div className="w-px h-8 bg-slate-800" />

        <button
          title="Not wired up yet"
          className="
          flex
          items-center
          gap-2
          bg-emerald-600
          hover:bg-emerald-500
          text-white
          px-6
          py-2.5
          rounded-xl
          font-semibold
          text-sm
          shadow-md
          shadow-emerald-600/20
          transition
          "
        >
          <span aria-hidden>✅</span>
          Submit
        </button>

      </div>

    </div>
  );
}

export default BottomToolbar;
