import { useEffect, useRef, useState } from "react";

// How long the Completed/Failed status stays before reverting to Ready.
const STATUS_RESET_DELAY_MS = 3000;

function Terminal({
  programInput = "",
  setProgramInput = () => {},
  output = "",
  runInfo = null,
  running = false,
  onClear = () => {},
}) {
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, running]);

  // Once a run finishes, show Completed/Failed briefly, then settle back to Ready.
  // This only affects the status pill's label — output stays visible either way.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (running) {
      setSettled(false);
      return;
    }
    if (output === "") {
      setSettled(false);
      return;
    }
    setSettled(false);
    const timer = setTimeout(() => setSettled(true), STATUS_RESET_DELAY_MS);
    return () => clearTimeout(timer);
  }, [running, output]);

  // UI-only classification of the output text, purely for display styling.
  // Does not touch execution logic — same output/runInfo/running props as before.
  const hasOutput = output !== "";
  const looksLikeError =
    hasOutput &&
    /(error|exception|traceback|segmentation fault|failed)/i.test(output);

  const status = running
    ? "running"
    : settled
    ? "ready"
    : looksLikeError
    ? "failed"
    : hasOutput
    ? "completed"
    : "ready";

  const statusConfig = {
    ready: { label: "Ready", color: "text-slate-400", dot: "bg-slate-500" },
    running: { label: "Running", color: "text-amber-400", dot: "bg-amber-400" },
    completed: { label: "Completed", color: "text-emerald-400", dot: "bg-emerald-400" },
    failed: { label: "Failed", color: "text-red-400", dot: "bg-red-400" },
  }[status];

  return (
    <div className="h-72 bg-black text-slate-200 flex flex-col border-t border-white/15">
      {/* HEADER */}
      <div className="h-9 bg-black border-b border-white/15 flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-slate-400 font-medium text-[11px] tracking-widest">
            TERMINAL
          </span>
        </div>

        {hasOutput && (
          <button
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* INPUT */}
        <div className="w-1/2 flex flex-col border-r border-white/15 min-w-0">
          <div className="px-3.5 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Program Input
          </div>

          <textarea
            value={programInput}
            onChange={(e) => setProgramInput(e.target.value)}
            spellCheck={false}
            className="
              flex-1
              resize-none
              bg-transparent
              text-slate-200
              font-mono
              text-[13.5px]
              leading-6
              outline-none
              border-0
              px-3.5
              pb-2
              caret-blue-400
              placeholder:text-slate-600
            "
            placeholder="Enter program input..."
          />

          <div className="h-7 flex items-center px-3.5 text-[11px] text-slate-500">
            {programInput === "" ? "0 lines" : `${programInput.split("\n").length} lines`}
          </div>
        </div>

        {/* OUTPUT */}
        <div className="w-1/2 flex flex-col min-w-0">
          <div className="px-3.5 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Output
          </div>

          <div
            ref={outputRef}
            className="flex-1 overflow-auto px-3.5 pb-2 font-mono text-[13.5px] leading-6"
          >
            {running ? (
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Running...
              </div>
            ) : hasOutput ? (
              <pre
                className={`whitespace-pre-wrap break-words m-0 ${
                  looksLikeError ? "text-red-400" : "text-slate-200"
                }`}
              >
                {output}
              </pre>
            ) : (
              <div className="text-slate-500">
                No output yet.
                <br />
                Run your program to see the results.
              </div>
            )}
          </div>

          <div className="h-7 flex items-center justify-between px-3.5 text-[11px]">
            <span className={`flex items-center gap-1.5 ${statusConfig.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>

            {runInfo && !running && (
              <span className="text-slate-500">
                {runInfo.time}s · {runInfo.memory} KB
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terminal;
