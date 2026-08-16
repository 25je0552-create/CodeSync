function BattleTerminal({ output, running, setOutput }) {
  const hasOutput = output !== "";

  const clearTerminal = () => {
    if (setOutput) setOutput("");
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-none overflow-hidden font-bugatti-mono">
      {/* Header */}
      <div className="bg-[#0d0d0d] border-b border-[#262626] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`w-2 h-2 rounded-full ${
              running ? "bg-[#d4a017] animate-pulse" : "bg-[#5fa657]"
            }`}
          />
          <h2 className="text-white text-xs uppercase tracking-[2px]">
            EXECUTION TERMINAL
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs uppercase tracking-[1.5px]">
          <span className={running ? "text-[#d4a017]" : "text-[#5fa657]"}>
            {running ? "EXECUTING" : "READY"}
          </span>

          {hasOutput && !running && (
            <button
              onClick={clearTerminal}
              className="text-[#999999] hover:text-white transition-colors cursor-pointer"
            >
              CLEAR OUTPUT
            </button>
          )}
        </div>
      </div>

      {/* Output Console */}
      <div className="h-[200px] bg-[#000000] text-xs p-5 overflow-y-auto whitespace-pre-wrap leading-6">
        {running ? (
          <span className="text-[#d4a017]">EXECUTING PROGRAM...</span>
        ) : hasOutput ? (
          <span className="text-[#e6e6e6]">{output}</span>
        ) : (
          <span className="text-[#666666]">
            NO OUTPUT GENERATED. RUN YOUR CODE TO VIEW TESTCASE RESULTS.
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#0d0d0d] border-t border-[#262626] px-5 py-2 flex justify-between text-[10px] uppercase tracking-[1.5px] text-[#666666]">
        <span>STATUS // {running ? "RUNNING" : hasOutput ? "COMPLETED" : "READY"}</span>
        <span>ENGINE // CODESYNC ARENA V1</span>
      </div>
    </div>
  );
}

export default BattleTerminal;
