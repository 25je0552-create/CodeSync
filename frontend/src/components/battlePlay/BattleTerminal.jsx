// output/running are now controlled by the parent (BattlePlay) so that
// BattleEditor and BottomToolbar see the same execution result — this
// component just displays it. setOutput is passed down purely so the
// Clear Output button can still reset the shared state.
function BattleTerminal({
    output,
    running,
    input,
    setInput,
}) {

  const hasOutput = output !== "";

  const clearTerminal = () => {
    setOutput("");
  };

  return (

    <div className="bg-[#1a1a1a] rounded-2xl border border-slate-800 shadow-lg overflow-hidden">

      {/* Header */}

      <div className="bg-[#1e1e1e] border-b border-slate-800 px-5 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span
            className={`
              w-2
              h-2
              rounded-full
              ${running ? "bg-amber-400 animate-pulse" : "bg-green-400"}
            `}
          />

          <h2 className="text-white font-semibold">
            Terminal
          </h2>

        </div>

        <div className="flex items-center gap-4">

          <span
            className={`
              text-sm
              ${running ? "text-amber-400" : "text-green-400"}
            `}
          >
            ● {running ? "Running" : "Ready"}
          </span>

          {hasOutput && !running && (
            <button
              onClick={clearTerminal}
              className="
              text-slate-400
              hover:text-white
              text-sm
              transition
              "
            >
              Clear Output
            </button>
          )}

        </div>

      </div>

      {/* Terminal */}

      <div
        className="
        h-[220px]
        bg-[#0D1117]
        font-mono
        text-sm
        p-5
        overflow-y-auto
        whitespace-pre-wrap
        "
      >
        {running ? (
          <span className="text-amber-400">Running...</span>
        ) : hasOutput ? (
          <span className="text-green-400">{output}</span>
        ) : (
          <span className="text-slate-500">
            No output yet. Run your code to see results.
          </span>
        )}
      </div>

      {/* Footer */}

      <div className="bg-[#1e1e1e] border-t border-slate-800 px-5 py-2 flex justify-between text-xs text-slate-400">

        <span>
          Status : {running ? "Running" : hasOutput ? "Completed" : "Ready"}
        </span>

        <span>
          Time : -- ms
        </span>

        <span>
          Memory : -- KB
        </span>

      </div>

    </div>

  );

}

export default BattleTerminal;
