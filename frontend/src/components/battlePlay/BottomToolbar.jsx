import axios from "axios";

function BottomToolbar({
  code,
  language,
  setOutput,
  running,
  setRunning,
}) {
  const handleRun = async () => {
    if (running) return;

    try {
      setRunning(true);
      setOutput("");

      const response = await axios.post("http://localhost:5000/execute", {
        code,
        language,
      });

      setOutput(response.data.output);
    } catch (error) {
      setOutput(
        error.response?.data?.output || "❌ Execution Failed."
      );
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="sticky bottom-4 bg-[#141414] border border-[#262626] rounded-none px-6 py-4 flex items-center justify-between gap-4 font-bugatti-mono shadow-2xl">
      {/* Left Context */}
      <div className="hidden sm:flex items-center gap-3 text-xs uppercase tracking-[2px] text-[#666666]">
        <span
          className={`w-2 h-2 rounded-full ${
            running ? "bg-[#d4a017] animate-pulse" : "bg-[#5fa657]"
          }`}
        />
        <span>STATUS // {running ? "EXECUTING" : "READY"}</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button
          onClick={handleRun}
          disabled={running}
          className="bugatti-button-secondary text-xs"
        >
          {running ? "EXECUTING..." : "▶ RUN CODE"}
        </button>

        <button
          title="AI Code Review"
          className="bugatti-button-secondary text-xs text-[#c3d9f3] border-[#c3d9f3]/40 hover:border-[#c3d9f3]"
        >
          AI REVIEW
        </button>

        <div className="w-px h-6 bg-[#262626]" />

        <button className="bugatti-button-primary text-xs">
          SUBMIT SOLUTION
        </button>
      </div>
    </div>
  );
}

export default BottomToolbar;
